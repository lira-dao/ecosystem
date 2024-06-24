import hre from 'hardhat';
import { dexRouterFixture } from '@lira-dao/dex-periphery/fixtures';
import { tokenDistributorFactory } from '@lira-dao/token-distributor/fixtures';
import { increaseTo } from '@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time';

export async function addressBookFixture() {
  const [deployer, dao, user] = await hre.ethers.getSigners();

  const router = await dexRouterFixture();

  const lpStakerContract = await hre.ethers.getContractFactory('LPStaker');
  const tokenStakerContract = await hre.ethers.getContractFactory('TokenStaker');

  const tbbFarm = await lpStakerContract.deploy(router.tbbPairAddress, router.ldtAddress, router.tbbAddress);
  const tbbFarmAddress = await tbbFarm.getAddress();

  const tbsFarm = await lpStakerContract.deploy(router.tbsPairAddress, router.ldtAddress, router.tbsAddress);
  const tbsFarmAddress = await tbsFarm.getAddress();

  const tbgFarm = await lpStakerContract.deploy(router.tbgPairAddress, router.ldtAddress, router.tbgAddress);
  const tbgFarmAddress = await tbgFarm.getAddress();

  const tbbStaker = await tokenStakerContract.deploy(router.tbbAddress, router.ldtAddress, router.tbbAddress);
  const tbbStakerAddress = await tbbStaker.getAddress();

  const tbsStaker = await tokenStakerContract.deploy(router.tbsAddress, router.ldtAddress, router.tbsAddress);
  const tbsStakerAddress = await tbsStaker.getAddress();

  const tbgStaker = await tokenStakerContract.deploy(router.tbgAddress, router.ldtAddress, router.tbgAddress);
  const tbgStakerAddress = await tbgStaker.getAddress();

  const addressBookContract = await hre.ethers.getContractFactory('AddressBook');
  const addressBook = await addressBookContract.deploy(
    { ldt: router.ldtAddress, tbb: router.tbbAddress, tbs: router.tbsAddress, tbg: router.tbgAddress },
    { tbb: tbbFarmAddress, tbs: tbsFarmAddress, tbg: tbgFarmAddress },
    { tbb: tbbStakerAddress, tbs: tbsStakerAddress, tbg: tbgStakerAddress },
  );
  const addressBookAddress = await addressBook.getAddress();

  return {
    ...router,
    addressBook,
    addressBookAddress,
    tbbFarmAddress,
    tbbStakerAddress,
    tbsFarmAddress,
    tbsStakerAddress,
    tbgFarmAddress,
    tbgStakerAddress,
  };
}

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

export async function rewardSplitterV2Factory() {
  const {
    deployer,
    ldt,
    ldtAddress,
    tbbAddress,
    tbsAddress,
    tbgAddress,
    tbbPairAddress,
    tbsPairAddress,
    tbgPairAddress,
    ...dex
  } = await dexRouterFixture();

  const lpStakerContract = await hre.ethers.getContractFactory('LPStaker');

  const tbbFarm = await lpStakerContract.deploy(tbbPairAddress, ldtAddress, tbbAddress);
  const tbbFarmAddress = await tbbFarm.getAddress();

  const tbsFarm = await lpStakerContract.deploy(tbsPairAddress, ldtAddress, tbsAddress);
  const tbsFarmAddress = await tbsFarm.getAddress();

  const tbgFarm = await lpStakerContract.deploy(tbgPairAddress, ldtAddress, tbgAddress);
  const tbgFarmAddress = await tbgFarm.getAddress();

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

  const farmSplitterFactory = await hre.ethers.getContractFactory('FarmSplitter');
  const farmSplitter = await farmSplitterFactory.deploy(
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

  const farmSplitterAddress = await farmSplitter.getAddress();

  const rewardSplitterFactory = await hre.ethers.getContractFactory('RewardSplitterV2');
  const rewardSplitter = await rewardSplitterFactory.deploy(
    ldtAddress,
    tbbAddress,
    tbbFarmAddress,
    tbsAddress,
    tbsFarmAddress,
    tbgAddress,
    tbgFarmAddress,
    distributorAddress,
    farmSplitterAddress,
  );

  const rewardSplitterAddress = await rewardSplitter.getAddress();

  await distributor.setSplitter(rewardSplitterAddress);

  return {
    ...dex,
    deployer,
    distributor,
    distributorAddress,
    ldt,
    ldtAddress,
    rewardSplitter,
    rewardSplitterAddress,
    tbbAddress,
    tbgAddress,
    tbsAddress,
    farmSplitter,
    farmSplitterAddress,
    tbbFarm,
    tbbFarmAddress,
    tbsFarm,
    tbsFarmAddress,
    tbgFarm,
    tbgFarmAddress,
  };
}
