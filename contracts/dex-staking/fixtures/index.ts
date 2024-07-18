import hre from 'hardhat';
import { dexRouterFixture } from '@lira-dao/dex-periphery/fixtures';
import { tokenDistributorFactory } from '@lira-dao/token-distributor/fixtures';
import { increaseTo } from '@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time';


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

  const boosterSplitterFactory = await hre.ethers.getContractFactory('BoostingSplitter');
  const boosterSplitter = await boosterSplitterFactory.deploy(
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
  const boosterSplitterAddress = await boosterSplitter.getAddress();

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
    boosterSplitter,
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
    deployer,
    distributor,
    distributorAddress,
    farmingSplitter,
    farmSplitterAddress,
    ldt,
    ldtAddress,
    ldtTeam,
    rewardSplitter,
    rewardSplitterAddress,
    tbb,
    tbbAddress,
    tbbBooster,
    tbbBoosterAddress,
    tbbFarm,
    tbbFarmAddress,
    tbbPairAddress,
    tbbStaker,
    tbbStakerAddress,
    tbg,
    tbgAddress,
    tbgBooster,
    tbgBoosterAddress,
    tbgFarm,
    tbgFarmAddress,
    tbgPairAddress,
    tbgStaker,
    tbgStakerAddress,
    tbs,
    tbsAddress,
    tbsBooster,
    tbsBoosterAddress,
    tbsFarm,
    tbsFarmAddress,
    tbsPairAddress,
    tbsStaker,
    tbsStakerAddress,
    teamSplitter,
    teamSplitterAddress,
  };
}
