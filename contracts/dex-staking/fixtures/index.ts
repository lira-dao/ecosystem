import hre from 'hardhat';
import { dexRouterFixture } from '@lira-dao/dex-periphery/fixtures';
import { tokenDistributorFactory } from '@lira-dao/token-distributor/fixtures';
import { increaseTo } from '@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time';


export async function lpStakerFixture() {
  const { tbbPairAddress, ldtAddress, tbbAddress, deployer, ...router } = await dexRouterFixture();

  const stakerContract = await hre.ethers.getContractFactory('LPStakerV3');
  const staker = await stakerContract.deploy(tbbPairAddress, ldtAddress, tbbAddress);
  const stakerAddress = await staker.getAddress();

  return {
    ...router,
    deployer,
    ldtAddress,
    staker,
    stakerAddress,
    tbbAddress,
    tbbPairAddress,
  };
}

export async function rewardSplitterFixture() {
  const {
    deployer,
    ldt,
    ldtAddress,
    tbb,
    tbbAddress,
    tbbPairAddress,
    tbg,
    tbgAddress,
    tbgPairAddress,
    tbs,
    tbsAddress,
    tbsPairAddress,
    ...dex
  } = await dexRouterFixture();

  const stakerContract = await hre.ethers.getContractFactory('LPStakerV3');

  const tbbStaker = await stakerContract.deploy(tbbPairAddress, ldtAddress, tbbAddress);
  const tbbStakerAddress = await tbbStaker.getAddress();

  const tbsStaker = await stakerContract.deploy(tbsPairAddress, ldtAddress, tbsAddress);
  const tbsStakerAddress = await tbsStaker.getAddress();

  const tbgStaker = await stakerContract.deploy(tbgPairAddress, ldtAddress, tbgAddress);
  const tbgStakerAddress = await tbgStaker.getAddress();

  const tokenDistributor = await tokenDistributorFactory.connect(deployer).deploy(ldtAddress);

  const tokenDistributorAddress = await tokenDistributor.getAddress();
  await ldt.approve(tokenDistributorAddress, 4_500_000_000n * (10n ** 18n));

  // @ts-ignore
  const deposit = await tokenDistributor.deposit([
    { amount: 2_025_000_000n * (10n ** 18n), emitted: 0n, rate: 5_547_945n * (10n ** 18n), cadence: 86400n },
    { amount: 1_125_000_000n * (10n ** 18n), emitted: 0n, rate: 3_082_191n * (10n ** 18n), cadence: 86400n },
    { amount: 675_000_000n * (10n ** 18n), emitted: 0n, rate: 1_849_315n * (10n ** 18n), cadence: 86400n },
    { amount: 675_000_000n * (10n ** 18n), emitted: 0n, rate: 924_657n * (10n ** 18n), cadence: 86400n },
  ]);

  let block = await deposit.getBlock();
  let time = block?.timestamp ?? 0;

  await increaseTo(time + 86400);

  const rewardSplitterFactory = await hre.ethers.getContractFactory('RewardSplitter');
  const rewardSplitter = await rewardSplitterFactory.deploy(ldtAddress, tokenDistributorAddress, tbbAddress, tbbStakerAddress, tbsAddress, tbsStakerAddress, tbgAddress, tbgStakerAddress);
  const rewardSplitterAddress = await rewardSplitter.getAddress();

  await tokenDistributor.setDistributor(rewardSplitterAddress);

  await tbb.transferOwnership(rewardSplitterAddress);
  await tbs.transferOwnership(rewardSplitterAddress);
  await tbg.transferOwnership(rewardSplitterAddress);

  await tbbStaker.transferOwnership(rewardSplitterAddress);
  await tbsStaker.transferOwnership(rewardSplitterAddress);
  await tbgStaker.transferOwnership(rewardSplitterAddress);

  return {
    ...dex,
    deployer,
    ldt,
    ldtAddress,
    rewardSplitter,
    rewardSplitterAddress,
    tbb,
    tbbPairAddress,
    tbbStaker,
    tbs,
    tbbStakerAddress,
    tbg,
    tbgStaker,
    tbgStakerAddress,
    tbsStaker,
    tbsStakerAddress,
    tokenDistributor,
  };
}
