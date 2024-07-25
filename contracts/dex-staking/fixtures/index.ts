import hre from 'hardhat';
import { dexRouterFixture } from '@lira-dao/dex-periphery/fixtures';
import { tokenDistributorFactory } from '@lira-dao/token-distributor/fixtures';
import { increaseTo } from '@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time';
import { parseUnits } from 'ethers';


export async function lpStakerFixture() {
  const router = await dexRouterFixture();

  const stakerContract = await hre.ethers.getContractFactory('LPStaker');
  const staker = await stakerContract.deploy(router.tbbPairAddress, router.ldtAddress, router.tbbAddress);
  const stakerAddress = await staker.getAddress();

  await router.tbb.approve(stakerAddress, hre.ethers.MaxUint256);
  await router.ldt.approve(stakerAddress, hre.ethers.MaxUint256);

  return {
    ...router,
    staker,
    stakerAddress,
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
    ldtTeam,
    ...dex
  } = await dexRouterFixture();

  const lpStakerContract = await hre.ethers.getContractFactory('LPStaker');
  const tokenStakerContract = await hre.ethers.getContractFactory('TokenStaker');

  const tbbFarm = await lpStakerContract.deploy(tbbPairAddress, ldtAddress, tbbAddress);
  const tbbFarmAddress = await tbbFarm.getAddress();

  const tbsFarm = await lpStakerContract.deploy(tbsPairAddress, ldtAddress, tbsAddress);
  const tbsFarmAddress = await tbsFarm.getAddress();

  const tbgFarm = await lpStakerContract.deploy(tbgPairAddress, ldtAddress, tbgAddress);
  const tbgFarmAddress = await tbgFarm.getAddress();

  const tbbStaker = await tokenStakerContract.deploy(tbbAddress, ldtAddress, tbbAddress);
  const tbbStakerAddress = await tbbStaker.getAddress();

  const tbsStaker = await tokenStakerContract.deploy(tbsAddress, ldtAddress, tbsAddress);
  const tbsStakerAddress = await tbsStaker.getAddress();

  const tbgStaker = await tokenStakerContract.deploy(tbgAddress, ldtAddress, tbgAddress);
  const tbgStakerAddress = await tbgStaker.getAddress();

  await tbb.approve(tbbStakerAddress, hre.ethers.MaxUint256);
  await tbs.approve(tbsStakerAddress, hre.ethers.MaxUint256);
  await tbg.approve(tbgStakerAddress, hre.ethers.MaxUint256);

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
  const rewardSplitter = await rewardSplitterFactory.deploy(
    {
      ldt: ldtAddress,
      distributor: tokenDistributorAddress,
      tbbAddress,
      tbbFarmAddress,
      tbbStakerAddress,
      tbsAddress,
      tbsFarmAddress,
      tbsStakerAddress,
      tbgAddress,
      tbgFarmAddress,
      tbgStakerAddress,
      teamAddress: ldtTeam,
    },
  );
  const rewardSplitterAddress = await rewardSplitter.getAddress();

  await tokenDistributor.setSplitter(rewardSplitterAddress);

  await tbb.transferOwnership(rewardSplitterAddress);
  await tbs.transferOwnership(rewardSplitterAddress);
  await tbg.transferOwnership(rewardSplitterAddress);

  await tbbFarm.transferOwnership(rewardSplitterAddress);
  await tbsFarm.transferOwnership(rewardSplitterAddress);
  await tbgFarm.transferOwnership(rewardSplitterAddress);

  await tbbStaker.transferOwnership(rewardSplitterAddress);
  await tbsStaker.transferOwnership(rewardSplitterAddress);
  await tbgStaker.transferOwnership(rewardSplitterAddress);

  return {
    ...dex,
    deployer,
    ldt,
    ldtAddress,
    ldtTeam,
    rewardSplitter,
    rewardSplitterAddress,
    tbb,
    tbbFarm,
    tbbFarmAddress,
    tbbPairAddress,
    tbbStaker,
    tbbStakerAddress,
    tbg,
    tbgFarm,
    tbgFarmAddress,
    tbgStaker,
    tbgStakerAddress,
    tbs,
    tbsFarm,
    tbsFarmAddress,
    tbsStaker,
    tbsStakerAddress,
    tokenDistributor,
  };
}

export async function rewardSplitterV2Fixture() {
  const {
    deployer,
    ldtTeam,
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

  const lpStakerContract = await hre.ethers.getContractFactory('LPStaker');
  const tokenStakerContract = await hre.ethers.getContractFactory('TokenStaker');
  const boosterStakerContract = await hre.ethers.getContractFactory('BoostingStaker');
  const timelockTokenContract = await hre.ethers.getContractFactory('TimelockTokenStaker');

  const tbbFarm = await lpStakerContract.deploy(tbbPairAddress, ldtAddress, tbbAddress);
  const tbbFarmAddress = await tbbFarm.getAddress();

  const tbsFarm = await lpStakerContract.deploy(tbsPairAddress, ldtAddress, tbsAddress);
  const tbsFarmAddress = await tbsFarm.getAddress();

  const tbgFarm = await lpStakerContract.deploy(tbgPairAddress, ldtAddress, tbgAddress);
  const tbgFarmAddress = await tbgFarm.getAddress();

  const tbbStaker = await tokenStakerContract.deploy(tbbAddress, ldtAddress, tbbAddress);
  const tbbStakerAddress = await tbbStaker.getAddress();

  const tbbBooster = await boosterStakerContract.deploy(ldtAddress, ldtAddress, tbbAddress, tbbStakerAddress);
  const tbbBoosterAddress = await tbbBooster.getAddress();

  const tbsStaker = await tokenStakerContract.deploy(tbsAddress, ldtAddress, tbsAddress);
  const tbsStakerAddress = await tbsStaker.getAddress();

  const tbsBooster = await boosterStakerContract.deploy(ldtAddress, ldtAddress, tbsAddress, tbsStakerAddress);
  const tbsBoosterAddress = await tbsBooster.getAddress();

  const tbgStaker = await tokenStakerContract.deploy(tbgAddress, ldtAddress, tbgAddress);
  const tbgStakerAddress = await tbgStaker.getAddress();

  const tbgBooster = await boosterStakerContract.deploy(ldtAddress, ldtAddress, tbgAddress, tbgStakerAddress);
  const tbgBoosterAddress = await tbgBooster.getAddress();

  const tbbTimelockStaker = await timelockTokenContract.deploy(tbbAddress, ldtAddress, tbbAddress, 14515200, 10, ldtTeam);
  const tbbTimelockStakerAddress = await tbbTimelockStaker.getAddress();
  const tbbTimelockStakerBooster = await boosterStakerContract.deploy(ldtAddress, ldtAddress, tbbAddress, tbbTimelockStakerAddress);
  const tbbTimelockStakerBoosterAddress = await tbbTimelockStakerBooster.getAddress();

  const tbsTimelockStaker = await timelockTokenContract.deploy(tbsAddress, ldtAddress, tbsAddress, 14515200, 10, ldtTeam);
  const tbsTimelockStakerAddress = await tbsTimelockStaker.getAddress();
  const tbsTimelockStakerBooster = await boosterStakerContract.deploy(ldtAddress, ldtAddress, tbsAddress, tbsTimelockStakerAddress);
  const tbsTimelockStakerBoosterAddress = await tbsTimelockStakerBooster.getAddress();

  const tbgTimelockStaker = await timelockTokenContract.deploy(tbgAddress, ldtAddress, tbgAddress, 14515200, 10, ldtTeam);
  const tbgTimelockStakerAddress = await tbgTimelockStaker.getAddress();
  const tbgTimelockStakerBooster = await boosterStakerContract.deploy(ldtAddress, ldtAddress, tbgAddress, tbgTimelockStakerAddress);
  const tbgTimelockStakerBoosterAddress = await tbgTimelockStakerBooster.getAddress();

  const distributor = await tokenDistributorFactory.connect(deployer).deploy(ldtAddress);
  const distributorAddress = await distributor.getAddress();
  await ldt.approve(distributorAddress, 4_500_000_000n * (10n ** 18n));

  // @ts-ignore
  const deposit = await distributor.deposit([
    { amount: 2_025_000_000n * (10n ** 18n), emitted: 0n, rate: 5_547_945n * (10n ** 18n), cadence: 86400n },
    { amount: 1_125_000_000n * (10n ** 18n), emitted: 0n, rate: 3_082_191n * (10n ** 18n), cadence: 86400n },
    { amount: 675_000_000n * (10n ** 18n), emitted: 0n, rate: 1_849_315n * (10n ** 18n), cadence: 86400n },
    { amount: 675_000_000n * (10n ** 18n), emitted: 0n, rate: 924_657n * (10n ** 18n), cadence: 86400n },
  ]);

  let block = await deposit.getBlock();
  let time = block?.timestamp ?? 0;
  await increaseTo(time + 86400);

  const farmSplitterFactory = await hre.ethers.getContractFactory('FarmingSplitter');
  const farmingSplitter = await farmSplitterFactory.deploy(
    ldtAddress,
    tbbAddress,
    tbsAddress,
    tbgAddress,
    [
      tbbFarmAddress,
      tbsFarmAddress,
      tbgFarmAddress,
    ],
  );
  const farmSplitterAddress = await farmingSplitter.getAddress();

  const stakingSplitterFactory = await hre.ethers.getContractFactory('StakingSplitter');
  const stakingSplitter = await stakingSplitterFactory.deploy(
    ldtAddress,
    tbbAddress,
    tbsAddress,
    tbgAddress,
    [
      tbbStakerAddress,
      tbsStakerAddress,
      tbgStakerAddress,
    ],
  );
  const stakingSplitterAddress = await stakingSplitter.getAddress();

  const boostingSplitterFactory = await hre.ethers.getContractFactory('BoostingSplitter');
  const boostingSplitter = await boostingSplitterFactory.deploy(
    ldtAddress,
    tbbAddress,
    tbsAddress,
    tbgAddress,
    [
      tbbBoosterAddress,
      tbsBoosterAddress,
      tbgBoosterAddress,
    ],
  );
  const boostingSplitterAddress = await boostingSplitter.getAddress();

  const teamSplitterFactory = await hre.ethers.getContractFactory('TeamSplitter');
  const teamSplitter = await teamSplitterFactory.deploy(
    tbbAddress,
    tbsAddress,
    tbgAddress,
  );
  const teamSplitterAddress = await teamSplitter.getAddress();

  const rewardSplitterFactory = await hre.ethers.getContractFactory('RewardSplitterV2');
  const rewardSplitter = await rewardSplitterFactory.deploy(
    ldtAddress,
    tbbAddress,
    tbsAddress,
    tbgAddress,
    distributorAddress,
    farmSplitterAddress,
    stakingSplitterAddress,
    boostingSplitter,
    teamSplitterAddress,
    ldtTeam,
    {
      farms: [tbbFarmAddress, tbsFarmAddress, tbgFarmAddress],
      stakers: [tbbStakerAddress, tbsStakerAddress, tbgStakerAddress],
      boosters: [tbbBoosterAddress, tbsBoosterAddress, tbgBoosterAddress],
    },
  );

  const rewardSplitterAddress = await rewardSplitter.getAddress();

  await distributor.setSplitter(rewardSplitterAddress);

  await tbbStaker.setBoosterAddress(tbbBoosterAddress);
  await tbsStaker.setBoosterAddress(tbsBoosterAddress);
  await tbgStaker.setBoosterAddress(tbgBoosterAddress);

  await tbbTimelockStaker.setBoosterAddress(tbbTimelockStakerBoosterAddress);
  await tbsTimelockStaker.setBoosterAddress(tbsTimelockStakerBoosterAddress);
  await tbgTimelockStaker.setBoosterAddress(tbgTimelockStakerBoosterAddress);

  await tbb.transferOwnership(rewardSplitterAddress);
  await tbs.transferOwnership(rewardSplitterAddress);
  await tbg.transferOwnership(rewardSplitterAddress);

  await tbbFarm.transferOwnership(rewardSplitterAddress);
  await tbsFarm.transferOwnership(rewardSplitterAddress);
  await tbgFarm.transferOwnership(rewardSplitterAddress);

  await tbbStaker.transferOwnership(rewardSplitterAddress);
  await tbsStaker.transferOwnership(rewardSplitterAddress);
  await tbgStaker.transferOwnership(rewardSplitterAddress);

  await tbbBooster.transferOwnership(rewardSplitterAddress);
  await tbsBooster.transferOwnership(rewardSplitterAddress);
  await tbgBooster.transferOwnership(rewardSplitterAddress);

  await rewardSplitter.approveTokens();

  await tbb.approve(tbbStakerAddress, hre.ethers.MaxUint256);
  await tbs.approve(tbsStakerAddress, hre.ethers.MaxUint256);
  await tbg.approve(tbgStakerAddress, hre.ethers.MaxUint256);

  await ldt.approve(tbbBoosterAddress, hre.ethers.MaxUint256);
  await ldt.approve(tbsBoosterAddress, hre.ethers.MaxUint256);
  await ldt.approve(tbgBoosterAddress, hre.ethers.MaxUint256);

  return {
    ...dex,
    boostingSplitter,
    boostingSplitterAddress,
    deployer,
    distributor,
    distributorAddress,
    farmSplitterAddress,
    farmingSplitter,
    ldt,
    ldtAddress,
    ldtTeam,
    rewardSplitter,
    rewardSplitterAddress,
    stakingSplitter,
    tbb,
    tbbAddress,
    tbbBooster,
    tbbBoosterAddress,
    tbbFarm,
    tbbFarmAddress,
    tbbPairAddress,
    tbbStaker,
    tbbStakerAddress,
    tbbTimelockStaker,
    tbbTimelockStakerAddress,
    tbbTimelockStakerBooster,
    tbbTimelockStakerBoosterAddress,
    tbg,
    tbgAddress,
    tbgBooster,
    tbgBoosterAddress,
    tbgFarm,
    tbgFarmAddress,
    tbgPairAddress,
    tbgStaker,
    tbgStakerAddress,
    tbgTimelockStaker,
    tbgTimelockStakerAddress,
    tbgTimelockStakerBooster,
    tbgTimelockStakerBoosterAddress,
    tbs,
    tbsAddress,
    tbsBooster,
    tbsBoosterAddress,
    tbsFarm,
    tbsFarmAddress,
    tbsPairAddress,
    tbsStaker,
    tbsStakerAddress,
    tbsTimelockStaker,
    tbsTimelockStakerAddress,
    tbsTimelockStakerBooster,
    tbsTimelockStakerBoosterAddress,
    teamSplitter,
    teamSplitterAddress,
  };
}

export async function rewardSplitterV2FixtureWithStake() {
  const {
    deployer,
    tbb,
    tbbBooster,
    tbbFarm,
    tbbFarmAddress,
    tbbPair,
    tbbStaker,
    tbg,
    tbgBooster,
    tbgFarm,
    tbgFarmAddress,
    tbgPair,
    tbgStaker,
    tbs,
    tbsBooster,
    tbsFarm,
    tbsFarmAddress,
    tbsPair,
    tbsStaker,
    ...splitter
  } = await rewardSplitterV2Fixture();

  await tbbPair.approve(tbbFarmAddress, await tbbPair.balanceOf(deployer));
  await tbbFarm.stake(await tbbPair.balanceOf(deployer));

  await tbsPair.approve(tbsFarmAddress, await tbsPair.balanceOf(deployer));
  await tbsFarm.stake(await tbsPair.balanceOf(deployer));

  await tbgPair.approve(tbgFarmAddress, await tbgPair.balanceOf(deployer));
  await tbgFarm.stake(await tbgPair.balanceOf(deployer));

  await tbb.mint(deployer, parseUnits('1', 18));
  await tbbStaker.stake(parseUnits('1', 18));
  await tbbBooster.stake(parseUnits('500', 18));

  await tbs.mint(deployer, parseUnits('1', 18));
  await tbsStaker.stake(parseUnits('1', 18));
  await tbsBooster.stake(parseUnits('5000', 18));

  await tbg.mint(deployer, parseUnits('1', 18));
  await tbgStaker.stake(parseUnits('1', 18));
  await tbgBooster.stake(parseUnits('50000', 18));

  return {
    ...splitter,
    deployer,
    tbb,
    tbbBooster,
    tbbFarm,
    tbbFarmAddress,
    tbbPair,
    tbbStaker,
    tbg,
    tbgBooster,
    tbgFarm,
    tbgFarmAddress,
    tbgPair,
    tbgStaker,
    tbs,
    tbsBooster,
    tbsFarm,
    tbsFarmAddress,
    tbsPair,
    tbsStaker,
  };
}
