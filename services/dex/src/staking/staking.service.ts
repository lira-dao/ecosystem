import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, isNull } from 'drizzle-orm';
import * as schema from '../db/schema';
import {
  referralsRewards,
  tokens,
  erc20Abi,
  EthereumAddress,
} from '@lira-dao/web3-utils';
import { Web3Provider } from '../services/web3.service';
import * as TokenStaker from '@lira-dao/web3-utils/dist/abi/json/TokenStaker.json';
import * as Multicall from '@lira-dao/web3-utils/dist/abi/json/Multicall.json';
import * as ReferralsRewards from '@lira-dao/web3-utils/dist/abi/json/ReferralsRewards.json';

interface RewardItem {
  wallet: string;
  ldt: bigint;
  tbb: bigint;
  tbs: bigint;
  tbg: bigint;
}

@Injectable()
export class StakingService implements OnModuleInit {
  private readonly logger = new Logger(StakingService.name);

  private referralsRewardsContract: any;
  private tokenContracts: Record<keyof RewardItem, EthereumAddress>;

  constructor(
    private readonly web3: Web3Provider,
    @Inject('DB_DEV') private drizzleDev: NodePgDatabase<typeof schema>,
  ) {}

  async onModuleInit() {
    const chainId = await this.web3.getChainId();
    this.logger.log(`Initialized StakingService with chainId: ${chainId}`);

    // const stakingContracts = tokenStakerAddresses[chainId.toString()];
    const referralsRewardsAddress = referralsRewards[chainId.toString()];
    this.tokenContracts = tokens[chainId.toString()];

    this.referralsRewardsContract = new this.web3.rpc.eth.Contract(
      ReferralsRewards.abi,
      referralsRewardsAddress,
    );

    // await this.sync(stakingContracts);
    // await this.listenToAllStakingEvents(stakingContracts);
  }

  async sync(stakingContracts: Record<string, string>) {
    this.logger.log('[sync] start');

    const endBlock = await this.web3.rpc.eth.getBlockNumber();
    this.logger.log('[sync] latestBlock: ' + endBlock.toString());

    // arbitrum sepolia
    const startBlocks = {
      tbb: 66269099,
      tbs: 66269125,
      tbg: 66269147,
    };

    const batchSize = 500000;
    let allEvents = [];

    for (const [tokenName, tokenStakerAddress] of Object.entries(
      stakingContracts,
    )) {
      const startBlock = startBlocks[tokenName];
      if (!startBlock) {
        this.logger.error(`[sync] Start block not found for ${tokenName}`);
        return;
      }

      this.logger.log(
        `[sync] Starting sync for ${tokenName} from block ${startBlock}`,
      );

      let currentStartBlock = startBlock;

      while (currentStartBlock <= endBlock) {
        const currentEndBlock = Math.min(
          currentStartBlock + batchSize - 1,
          Number(endBlock),
        );

        try {
          this.logger.log(
            `[sync] fetching events from block ${currentStartBlock} to ${currentEndBlock}`,
          );

          const events = (
            await this.fetchStakingEvents(
              tokenStakerAddress,
              currentStartBlock,
              currentEndBlock,
            )
          ).map((event) => {
            if (typeof event === 'object') {
              return { ...event, tokenName };
            }
            return event;
          });

          allEvents = allEvents.concat(events);
        } catch (error) {
          this.logger.error(
            `Error fetching events from blocks ${currentStartBlock} to ${currentEndBlock}:`,
            error,
          );
        }

        currentStartBlock = currentEndBlock + 1;
      }

      await this.sleep(1000);
    }

    let stakeEventCount = 0;
    let harvestEventCount = 0;

    for (const event of allEvents) {
      if (event.event === 'Stake') {
        stakeEventCount++;

        const exists = await this.drizzleDev
          .select()
          .from(schema.stakingRewards)
          .where(eq(schema.stakingRewards.stakingTxId, event.transactionHash))
          .limit(1);

        if (exists.length === 0) {
          const address = event.returnValues.wallet as EthereumAddress;
          const amount = BigInt(event.returnValues.amount as string);
          const txId = event.transactionHash;

          const alreadyStaked = await this.hasStaked(address);
          if (!alreadyStaked) {
            const referrer = await this.getReferrer(address);
            if (referrer) {
              const rewardAmount = (amount * 10n) / 100n; // Calculate reward (10% of staking)

              const tokenAddress = this.tokenContracts[
                event.tokenName
              ] as EthereumAddress;

              const insertResult = await this.drizzleDev
                .insert(schema.stakingRewards)
                .values({
                  stakerAddress: address,
                  referrerAddress: referrer,
                  tokenAddress: tokenAddress,
                  stakedAmount: amount.toString(),
                  rewardAmount: rewardAmount.toString(),
                  stakingTxId: txId,
                  rewardTxId: null,
                })
                .returning();

              if (insertResult.length > 0) {
                this.logger.log(
                  `[${event.tokenName}] Staking record created: stakerAddress=${address}, referrerAddress=${referrer}, amount=${amount}, rewardAmount=${rewardAmount}, txId=${txId}`,
                );
              } else {
                this.logger.error(
                  `[${event.tokenName}] Error inserting staking record for wallet=${address}`,
                );
              }
            }
          }
        }
      }

      if (event.event === 'Harvest') {
        harvestEventCount++;

        const existsHarvest = await this.drizzleDev
          .select()
          .from(schema.referralRewards)
          .where(eq(schema.referralRewards.harvestTxId, event.transactionHash))
          .limit(1);

        if (existsHarvest.length === 0) {
          const address = event.returnValues.wallet as EthereumAddress;
          const amountLDT = BigInt(event.returnValues.amountToken1 as string);
          const amountTB = BigInt(event.returnValues.amountToken2 as string);
          const txId = event.transactionHash;

          this.logger.log(
            `[${event.tokenName}] Harvest event: wallet=${address}, amount=[${amountLDT}, ${amountTB})], txId=${txId}`,
          );

          const referrers = await this.getLevelsReferrer(address);
          if (!referrers) {
            this.logger.log(
              `No referrer found for staker ${address}. Skipping referral reward.`,
            );
            continue;
          }

          const firstLevelRewardLDT = (amountLDT * 25n) / 1000n;
          const secondLevelRewardLDT = (amountLDT * 15n) / 1000n;
          const thirdLevelRewardLDT = (amountLDT * 10n) / 1000n;

          const firstLevelRewardTB = (amountTB * 25n) / 1000n;
          const secondLevelRewardTB = (amountTB * 15n) / 1000n;
          const thirdLevelRewardTB = (amountTB * 10n) / 1000n;

          if (referrers.firstLevel) {
            await this.saveReferralReward(
              referrers.firstLevel,
              [
                this.tokenContracts['ldt'],
                this.tokenContracts[event.tokenName],
              ],
              [firstLevelRewardLDT, firstLevelRewardTB],
              txId,
            );
          }
          if (referrers.secondLevel) {
            await this.saveReferralReward(
              referrers.secondLevel,
              [
                this.tokenContracts['ldt'],
                this.tokenContracts[event.tokenName],
              ],
              [secondLevelRewardLDT, secondLevelRewardTB],
              txId,
            );
          }
          if (referrers.thirdLevel) {
            await this.saveReferralReward(
              referrers.thirdLevel,
              [
                this.tokenContracts['ldt'],
                this.tokenContracts[event.tokenName],
              ],
              [thirdLevelRewardLDT, thirdLevelRewardTB],
              txId,
            );
          }
        }
      }

      await this.sleep(1000);
    }

    this.logger.log(
      `[sync] Processed ${stakeEventCount} Stake events and ${harvestEventCount} Harvest events`,
    );
  }

  async fetchStakingEvents(
    contractAddress: string,
    fromBlock: number,
    toBlock: number,
  ) {
    const contract = new this.web3.rpc.eth.Contract(
      TokenStaker.abi,
      contractAddress,
    );

    return await contract.getPastEvents('allEvents', {
      fromBlock,
      toBlock,
    });
  }

  async listenToAllStakingEvents(stakingContracts: Record<string, string>) {
    const tokenLdtAddress = this.tokenContracts['ldt'];

    await Promise.all(
      Object.keys(stakingContracts).map(async (key) => {
        const tokenStakerAddress = stakingContracts[key];
        const tokenAddress = this.tokenContracts[key];

        this.logger.log(
          `[listenToAllStakingEvents] Subscribing to Stake/Unstake, Harvest events for ${key} at address ${tokenStakerAddress} from token ${tokenAddress}`,
        );
        await this.listenToStakingEvents(
          tokenStakerAddress,
          tokenAddress,
          tokenLdtAddress,
          key,
        );
      }),
    );
  }

  async listenToStakingEvents(
    tokenStakerAddress: string,
    tokenAddress: EthereumAddress,
    ldtTokenAddress: EthereumAddress,
    contractName: string,
  ) {
    const contract = new this.web3.socket.eth.Contract(
      TokenStaker.abi,
      tokenStakerAddress,
    );

    contract.events.Stake().on('data', async (event) => {
      const address = event.returnValues.wallet as EthereumAddress;
      const amount = BigInt(event.returnValues.amount as string);
      const txId = event.transactionHash;

      this.logger.log(
        `[${contractName}] Stake event: wallet=${address}, amount=${amount}, txId=${txId}`,
      );

      const alreadyStaked = await this.hasStaked(address);
      if (!alreadyStaked) {
        const referrer = await this.getReferrer(address);
        if (referrer) {
          const rewardAmount = (amount * 10n) / 100n; // Calculate reward (10% of staking)

          const insertResult = await this.drizzleDev
            .insert(schema.stakingRewards)
            .values({
              stakerAddress: address,
              referrerAddress: referrer,
              tokenAddress: tokenAddress,
              stakedAmount: amount.toString(),
              rewardAmount: rewardAmount.toString(),
              stakingTxId: txId,
              rewardTxId: null,
            })
            .returning();

          if (insertResult.length > 0) {
            this.logger.log(
              `[${contractName}] Staking record created: stakerAddress=${address}, referrerAddress=${referrer}, amount=${amount}, rewardAmount=${rewardAmount}, txId=${txId}`,
            );
          } else {
            this.logger.error(
              `[${contractName}] Error inserting staking record for wallet=${address}`,
            );
          }
        }
      }
    });

    contract.events.Harvest().on('data', async (event) => {
      const address = event.returnValues.wallet as EthereumAddress;
      const amountLDT = BigInt(event.returnValues.amountToken1 as string);
      const amountTB = BigInt(event.returnValues.amountToken2 as string);
      const txId = event.transactionHash;

      this.logger.log(
        `[${contractName}] Harvest event: wallet=${address}, amount=[${amountLDT}, ${amountTB})], txId=${txId}`,
      );

      const referrers = await this.getLevelsReferrer(address);
      if (!referrers) {
        this.logger.log(
          `No referrer found for staker ${address}. Skipping referral reward.`,
        );
        return;
      }

      const firstLevelRewardLDT = (amountLDT * 25n) / 1000n;
      const secondLevelRewardLDT = (amountLDT * 15n) / 1000n;
      const thirdLevelRewardLDT = (amountLDT * 10n) / 1000n;

      const firstLevelRewardTB = (amountTB * 25n) / 1000n;
      const secondLevelRewardTB = (amountTB * 15n) / 1000n;
      const thirdLevelRewardTB = (amountTB * 10n) / 1000n;

      if (referrers.firstLevel) {
        await this.saveReferralReward(
          referrers.firstLevel,
          [ldtTokenAddress, tokenAddress],
          [firstLevelRewardLDT, firstLevelRewardTB],
          txId,
        );
      }
      if (referrers.secondLevel) {
        await this.saveReferralReward(
          referrers.secondLevel,
          [ldtTokenAddress, tokenAddress],
          [secondLevelRewardLDT, secondLevelRewardTB],
          txId,
        );
      }
      if (referrers.thirdLevel) {
        await this.saveReferralReward(
          referrers.thirdLevel,
          [ldtTokenAddress, tokenAddress],
          [thirdLevelRewardLDT, thirdLevelRewardTB],
          txId,
        );
      }
    });

    contract.events.Unstake().on('data', async (event) => {
      const address = event.returnValues.wallet as EthereumAddress;
      const amount = event.returnValues.amount;
      const txId = event.transactionHash;

      this.logger.log(
        `[${contractName}] Unstake event: stakerAddress=${address}, amount=${amount}, txId=${txId}`,
      );
    });

    contract.events.Stake().on('error', (error) => {
      this.logger.error(
        `[${contractName}] Error catching Stake event: ${error}`,
        error,
      );
    });

    contract.events.Unstake().on('error', (error) => {
      this.logger.error(
        `[${contractName}] Error catching Unstake event: ${error}`,
        error,
      );
    });
  }

  async hasStaked(walletAddress: string): Promise<boolean> {
    const result = await this.drizzleDev
      .select()
      .from(schema.stakingRewards)
      .where(eq(schema.stakingRewards.stakerAddress, walletAddress))
      .limit(1);

    return result.length > 0;
  }

  async getReferrer(address: string): Promise<string | null> {
    const result = await this.drizzleDev
      .select()
      .from(schema.referral)
      .where(eq(schema.referral.referral, address));

    return result.length > 0 ? result[0].referrer : null;
  }

  private async getLevelsReferrer(address: string) {
    const firstLevelReferrer = await this.drizzleDev
      .select()
      .from(schema.referral)
      .where(eq(schema.referral.referral, address))
      .then((res) => res[0]?.referrer);

    if (!firstLevelReferrer) return null;

    const secondLevelReferrer = await this.drizzleDev
      .select()
      .from(schema.referral)
      .where(eq(schema.referral.referral, firstLevelReferrer))
      .then((res) => res[0]?.referrer);

    const thirdLevelReferrer = secondLevelReferrer
      ? await this.drizzleDev
          .select()
          .from(schema.referral)
          .where(eq(schema.referral.referral, secondLevelReferrer))
          .then((res) => res[0]?.referrer)
      : null;

    return {
      firstLevel: firstLevelReferrer,
      secondLevel: secondLevelReferrer,
      thirdLevel: thirdLevelReferrer,
    };
  }

  private async saveReferralReward(
    referrerAddress: string,
    tokenAddresses: EthereumAddress[], // Array of token addresses (LDT and TB)
    amounts: bigint[], // Array of amounts corresponding to the tokens (LDT and TB amounts)
    txId: string,
  ) {
    if (tokenAddresses.length !== amounts.length) {
      this.logger.error(
        `Mismatch between tokenAddresses and amounts length for referrer ${referrerAddress}`,
      );
      return;
    }

    await this.drizzleDev.insert(schema.referralRewards).values({
      referrerAddress,
      tokenAddresses,
      amounts: amounts.map((amount) => amount.toString()),
      harvestTxId: txId,
      status: 'pending',
      createdAt: new Date(),
    });

    this.logger.log(
      `Saved referral rewards for referrer ${referrerAddress} in harvest transaction ${txId}`,
    );
  }

  @Cron('0 2 * * *')
  async distributePendingRewards() {
    try {
      this.logger.debug('Checking for pending rewards to distribute.');

      const unrewardedStakes = await this.drizzleDev
        .select()
        .from(schema.stakingRewards)
        .where(isNull(schema.stakingRewards.rewardTxId));

      if (unrewardedStakes.length > 0) {
        this.logger.log(
          `Found ${unrewardedStakes.length} unrewarded stakes. Processing multicall.`,
        );

        const chainId = await this.web3.getChainId();

        // TODO: Improve with lira-dao/utils
        const multicallAddress =
          chainId === 421614n
            ? '0xA115146782b7143fAdB3065D86eACB54c169d092'
            : '0x842eC2c7D803033Edf55E478F461FC547Bc54EB2';

        const multicallContract = new this.web3.rpc.eth.Contract(
          Multicall,
          multicallAddress,
        );

        // Calculate total reward amount needed per token
        const tokenRewardAmounts: Record<string, bigint> = {};
        unrewardedStakes.forEach((stake) => {
          if (!tokenRewardAmounts[stake.tokenAddress]) {
            tokenRewardAmounts[stake.tokenAddress] = BigInt(0);
          }
          tokenRewardAmounts[stake.tokenAddress] +=
            BigInt(stake.rewardAmount) * 2n; // For staker and referrer
        });

        // Ensure allowances are sufficient
        for (const [tokenAddress, totalRewardAmount] of Object.entries(
          tokenRewardAmounts,
        )) {
          const tbTokenContract = new this.web3.rpc.eth.Contract(
            erc20Abi,
            tokenAddress,
          );
          const allowance = await tbTokenContract.methods
            .allowance(process.env.WALLET_ADDRESS, multicallAddress)
            .call();

          if (BigInt(allowance) < totalRewardAmount) {
            const approveTxData = tbTokenContract.methods
              .approve(multicallAddress, totalRewardAmount.toString())
              .encodeABI();

            const approveGasEstimate = await this.web3.rpc.eth.estimateGas({
              from: process.env.WALLET_ADDRESS,
              to: tokenAddress,
              data: approveTxData,
            });

            const block = await this.web3.rpc.eth.getBlock('latest');

            const tx = {
              from: process.env.WALLET_ADDRESS,
              to: tokenAddress,
              data: approveTxData,
              gas: approveGasEstimate.toString(),
              maxFeePerGas: block.baseFeePerGas * 2n,
              maxPriorityFeePerGas: 100000,
            };

            const signedTx = await this.web3.rpc.eth.accounts.signTransaction(
              tx,
              process.env.WALLET_PRIVATE_KEY,
            );
            await this.web3.rpc.eth.sendSignedTransaction(
              signedTx.rawTransaction,
            );
            this.logger.log(`Approved ${tokenAddress} successfully`);
          }
        }

        // Prepare and send multicall for transfers
        const calls = unrewardedStakes.flatMap((stake) => {
          const tbTokenContract = new this.web3.rpc.eth.Contract(
            erc20Abi,
            stake.tokenAddress,
          );
          return [
            {
              target: stake.tokenAddress,
              callData: tbTokenContract.methods
                .transferFrom(
                  process.env.WALLET_ADDRESS,
                  stake.stakerAddress,
                  stake.rewardAmount.toString(),
                )
                .encodeABI(),
            },
            {
              target: stake.tokenAddress,
              callData: tbTokenContract.methods
                .transferFrom(
                  process.env.WALLET_ADDRESS,
                  stake.referrerAddress,
                  stake.rewardAmount.toString(),
                )
                .encodeABI(),
            },
          ];
        });

        const tx = multicallContract.methods.tryAggregate(false, calls);
        const gasEstimate = await tx.estimateGas({
          from: process.env.WALLET_ADDRESS,
        });

        const block = await this.web3.rpc.eth.getBlock('latest');

        const signedTx = await this.web3.rpc.eth.accounts.signTransaction(
          {
            from: process.env.WALLET_ADDRESS,
            to: multicallAddress,
            data: tx.encodeABI(),
            gas: gasEstimate.toString(),
            maxFeePerGas: block.baseFeePerGas * 2n,
            maxPriorityFeePerGas: 100000,
          },
          process.env.WALLET_PRIVATE_KEY,
        );

        const receipt = await this.web3.rpc.eth.sendSignedTransaction(
          signedTx.rawTransaction,
        );
        this.logger.log(
          `Transaction to staker completed. Hash: ${receipt.transactionHash}`,
        );

        await this.updateRewardTxId(unrewardedStakes, receipt.transactionHash);
      } else {
        this.logger.log('No unrewarded stakes found.');
      }
    } catch (error) {
      this.logger.error('Error in distributePendingRewards', error);
    }
  }

  private async updateRewardTxId(stakes, hash) {
    await Promise.all(
      stakes.map((stake) => {
        return this.drizzleDev
          .update(schema.stakingRewards)
          .set({ rewardTxId: hash })
          .where(eq(schema.stakingRewards.stakerAddress, stake.stakerAddress));
      }),
    );
  }

  @Cron('0 1 * * *')
  async distributePendingReferralRewards() {
    try {
      this.logger.debug('Checking for pending referral rewards to distribute.');

      const pendingRewards = await this.drizzleDev
        .select()
        .from(schema.referralRewards)
        .where(eq(schema.referralRewards.status, 'pending'));

      if (pendingRewards.length === 0) {
        this.logger.log('No pending rewards to distribute.');
        return;
      }

      // Aggregate rewards by referrerAddress and tokenAddresses
      const rewardsMap: Record<
        string,
        Partial<Record<keyof RewardItem, bigint>>
      > = {};
      const tokenTotals: Partial<Record<keyof RewardItem, bigint>> = {};

      for (const reward of pendingRewards) {
        const referrer = reward.referrerAddress;

        if (!rewardsMap[referrer]) {
          rewardsMap[referrer] = {};
        }

        reward.tokenAddresses.forEach((tokenAddress, index) => {
          const amount = BigInt(reward.amounts[index]);
          const tokenKey = this.getTokenKeyByAddress(tokenAddress);

          if (tokenKey) {
            const existingAmount = rewardsMap[referrer]![tokenKey] ?? 0n;
            rewardsMap[referrer]![tokenKey] = existingAmount + amount;

            tokenTotals[tokenKey] = (tokenTotals[tokenKey] ?? 0n) + amount;
          }
        });
      }

      const rewardItems = Object.entries(rewardsMap).map(
        ([wallet, reward]) => ({
          wallet,
          ldt: reward.ldt || 0n,
          tbb: reward.tbb || 0n,
          tbs: reward.tbs || 0n,
          tbg: reward.tbg || 0n,
        }),
      );

      const rewardItemsForLogging = JSON.parse(
        JSON.stringify(rewardItems, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      );
      this.logger.log(
        `Aggregated referral rewards: ${JSON.stringify(rewardItemsForLogging)}`,
      );

      const chainId = await this.web3.getChainId();
      const multicallAddress =
        chainId === 421614n
          ? '0xA115146782b7143fAdB3065D86eACB54c169d092'
          : '0x842eC2c7D803033Edf55E478F461FC547Bc54EB2';

      for (const [tokenKey, totalAmount] of Object.entries(tokenTotals)) {
        const tokenAddress = this.tokenContracts[tokenKey as keyof RewardItem];
        const tokenContract = new this.web3.rpc.eth.Contract(
          erc20Abi,
          tokenAddress,
        );

        const allowance = await tokenContract.methods
          .allowance(process.env.WALLET_ADDRESS, multicallAddress)
          .call();

        if (BigInt(allowance) < totalAmount!) {
          const approveTxData = tokenContract.methods
            .approve(multicallAddress, totalAmount!.toString())
            .encodeABI();

          const approveGasEstimate = await this.web3.rpc.eth.estimateGas({
            from: process.env.WALLET_ADDRESS,
            to: tokenAddress,
            data: approveTxData,
          });

          const block = await this.web3.rpc.eth.getBlock('latest');

          const approveTx = {
            from: process.env.WALLET_ADDRESS,
            to: tokenAddress,
            data: approveTxData,
            gas: approveGasEstimate.toString(),
            maxFeePerGas: block.baseFeePerGas * 2n,
            maxPriorityFeePerGas: 100000,
          };

          const signedApproveTx =
            await this.web3.rpc.eth.accounts.signTransaction(
              approveTx,
              process.env.WALLET_PRIVATE_KEY,
            );
          await this.web3.rpc.eth.sendSignedTransaction(
            signedApproveTx.rawTransaction,
          );
          this.logger.log(`Allowance set for ${tokenAddress} successfully`);
        }
      }

      const multicallContract = new this.web3.rpc.eth.Contract(
        Multicall,
        multicallAddress,
      );

      const transfers = Object.entries(tokenTotals).map(
        ([tokenKey, totalAmount]) => {
          const tokenAddress =
            this.tokenContracts[tokenKey as keyof RewardItem];
          const tokenContract = new this.web3.rpc.eth.Contract(
            erc20Abi,
            tokenAddress,
          );

          return {
            target: tokenAddress,
            callData: tokenContract.methods
              .transferFrom(
                process.env.WALLET_ADDRESS,
                this.referralsRewardsContract.options.address,
                totalAmount!.toString(),
              )
              .encodeABI(),
          };
        },
      );

      const multicallTx = multicallContract.methods.tryAggregate(
        false,
        transfers,
      );
      const multicallGasEstimate = await multicallTx.estimateGas({
        from: process.env.WALLET_ADDRESS,
      });

      let block = await this.web3.rpc.eth.getBlock('latest');

      const signedMulticallTx =
        await this.web3.rpc.eth.accounts.signTransaction(
          {
            from: process.env.WALLET_ADDRESS,
            to: multicallAddress,
            data: multicallTx.encodeABI(),
            gas: multicallGasEstimate.toString(),
            maxFeePerGas: block.baseFeePerGas * 2n,
            maxPriorityFeePerGas: 100000,
          },
          process.env.WALLET_PRIVATE_KEY,
        );

      const multicallReceipt = await this.web3.rpc.eth.sendSignedTransaction(
        signedMulticallTx.rawTransaction,
      );
      this.logger.log(
        `Multicall transaction completed. Hash: ${multicallReceipt.transactionHash}`,
      );

      const distributeTxData = this.referralsRewardsContract.methods
        .distributeRewards(rewardItems)
        .encodeABI();

      const gasEstimate = await this.web3.rpc.eth.estimateGas({
        from: process.env.WALLET_ADDRESS,
        to: this.referralsRewardsContract.options.address,
        data: distributeTxData,
      });

      block = await this.web3.rpc.eth.getBlock('latest');

      const signedTx = await this.web3.rpc.eth.accounts.signTransaction(
        {
          from: process.env.WALLET_ADDRESS,
          to: this.referralsRewardsContract.options.address,
          data: distributeTxData,
          gas: gasEstimate.toString(),
          maxFeePerGas: block.baseFeePerGas * 2n,
          maxPriorityFeePerGas: 100000,
        },
        process.env.WALLET_PRIVATE_KEY,
      );

      const distributeRewardsTx = await this.web3.rpc.eth.sendSignedTransaction(
        signedTx.rawTransaction,
      );
      this.logger.log(
        `Rewards distribution successfully. Hash: ${distributeRewardsTx.transactionHash}`,
      );

      // Update the status of the distributed rewards in the database
      for (const reward of pendingRewards) {
        await this.drizzleDev
          .update(schema.referralRewards)
          .set({
            distributionTxId: distributeRewardsTx.transactionHash as string,
            status: 'distributed',
            distributedAt: new Date(),
          })
          .where(
            and(
              eq(
                schema.referralRewards.referrerAddress,
                reward.referrerAddress,
              ),
              eq(schema.referralRewards.status, 'pending'),
            ),
          );
      }

      this.logger.log('All pending rewards have been marked as distributed.');
    } catch (error) {
      this.logger.error('Error in distributePendingRewards', error);
    }
  }

  private getTokenKeyByAddress(address: string): keyof RewardItem | null {
    const entries = Object.entries(this.tokenContracts);
    for (const [key, value] of entries) {
      if (value === address) {
        return key as keyof RewardItem;
      }
    }
    return null;
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
