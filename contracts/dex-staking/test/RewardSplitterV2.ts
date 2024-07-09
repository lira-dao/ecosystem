import { rewardSplitterV2Fixture } from '../fixtures';
import { expect } from 'chai';
import { parseUnits } from 'ethers';

describe('RewardSplitterV2', () => {
  it('should have ldt address', async () => {
    const { rewardSplitter, ldtAddress } = await rewardSplitterV2Fixture();

    expect(await rewardSplitter.ldt()).eq(ldtAddress);
  });

  it('should have tbb address', async () => {
    const { rewardSplitter, tbbAddress } = await rewardSplitterV2Fixture();

    expect(await rewardSplitter.tbb()).eq(tbbAddress);
  });

  it('should have tbs address', async () => {
    const { rewardSplitter, tbsAddress } = await rewardSplitterV2Fixture();

    expect(await rewardSplitter.tbs()).eq(tbsAddress);
  });

  it('should have tbg address', async () => {
    const { rewardSplitter, tbgAddress } = await rewardSplitterV2Fixture();

    expect(await rewardSplitter.tbg()).eq(tbgAddress);
  });

  it('should have distributor address', async () => {
    const { rewardSplitter, distributorAddress } = await rewardSplitterV2Fixture();

    expect(await rewardSplitter.distributor()).eq(distributorAddress);
  });

  it('should calculate total rewards', async () => {
    const {
      rewardSplitter,
      rewardSplitterAddress,
      ldt,
      ldtTeam,
      distributorAddress,
      tbb,
      tbbFarmAddress,
      tbbFarm,
      tbbPair,
      tbs,
      tbsFarmAddress,
      tbsPair,
      tbsFarm,
      tbg,
      tbgFarmAddress,
      tbgPair,
      tbgFarm,
      deployer,
      tbbStaker,
      tbsStaker,
      tbgStaker,
      tbbBooster,
      tbsBooster,
      tbgBooster,
    } = await rewardSplitterV2Fixture();

    console.log('LP', {
      tbb: await tbbPair.balanceOf(deployer),
      tbs: await tbsPair.balanceOf(deployer),
      tbg: await tbgPair.balanceOf(deployer),
    });

    // @ts-ignore
    await ldt.connect(ldtTeam).burn(await ldt.balanceOf(ldtTeam));

    console.log('team before', {
      ldt: await ldt.balanceOf(ldtTeam),
      tbb: await tbb.balanceOf(ldtTeam),
      tbs: await tbs.balanceOf(ldtTeam),
      tbg: await tbg.balanceOf(ldtTeam),
    });

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

    await expect(rewardSplitter.distributeRewards())
      // .emit(rewardSplitter, 'DistributeRewards')
      // .withArgs([
      //   5_547_945_000_000_000_000_000_000n, // total
      //   1_109_589_000_000_000_000_000_000n, // ldt 20%
      //   4_438_356_000_000_000_000_000_000n, // tb 80%
      //   [parseUnits('221917.8', 18), parseUnits('1775342.4', 18)], // farming
      //   [parseUnits('221917.8', 18), parseUnits('554794.5', 18)], // staking
      //   [parseUnits('221917.8', 18), parseUnits('554794.5', 18)], // booster
      //   [parseUnits('110958.9', 18), parseUnits('443835.6', 18)], // team
      // ])
      // .emit(rewardSplitter, 'DistributeFarmingRewards')
      // .withArgs(
      //   [
      //     [
      //       [1999999999999999999936n, 1999999999999999999n, 999999999999999999968377n, 999999999999999999968n],
      //       73_972_600_000_000_000_000_000n,
      //       1999999999999999999n,
      //     ],
      //     [
      //       [4999999999999999999500n, 499999999999999999n, 999999999999999999900000n, 99999999999999999990n],
      //       73972600000000000000000n,
      //       499999999999999999n,
      //     ],
      //     [
      //       [9999999999999999996837n, 99999999999999999n, 999999999999999999683772n, 9999999999999999996n],
      //       73972600000000000000000n,
      //       99999999999999999n,
      //     ],
      //   ],
      // )
      // .emit(rewardSplitter, 'DistributeStakingRewards')
      // .withArgs(
      //   [
      //     [
      //       [parseUnits('1', 18), parseUnits('0.001', 18), parseUnits('500', 18), parseUnits('0.5', 18)],
      //       parseUnits('1', 18),
      //       parseUnits('0.001', 18),
      //     ],
      //     [
      //       [parseUnits('25', 18), parseUnits('0.0025', 18), parseUnits('5000', 18), parseUnits('0.5', 18)],
      //       parseUnits('25', 18),
      //       parseUnits('0.0025', 18),
      //     ],
      //     [
      //       [parseUnits('500', 18), parseUnits('0.005', 18), parseUnits('50000', 18), parseUnits('0.5', 18)],
      //       parseUnits('500', 18),
      //       parseUnits('0.005', 18),
      //     ],
      //   ],
      // )
      // .emit(rewardSplitter, 'DistributeBoostingRewards')
      // .withArgs(
      //   [
      //     [
      //       [parseUnits('1', 18), parseUnits('0.1', 18), parseUnits('50000', 18), parseUnits('50', 18)],
      //       999,
      //       888,
      //     ],
      //     [
      //       [1, 2, 3, 4],
      //       5,
      //       6,
      //     ],
      //     [
      //       [7, 8, 9, 10],
      //       11,
      //       12,
      //     ],
      //   ],
      // )
      // .emit(rewardSplitter, 'DistributeTeamRewards')
      // .withArgs(
      //   [
      //     110958_900000000000000000n,
      //     14_999999999999999999n,
      //     5_999999999999999999n,
      //     2219178000000000000n,
      //   ],
      // );

    await ldt.burn(await ldt.balanceOf(deployer));

    console.log('team after', {
      ldt: await ldt.balanceOf(ldtTeam),
      tbb: await tbb.balanceOf(ldtTeam),
      tbs: await tbs.balanceOf(ldtTeam),
      tbg: await tbg.balanceOf(ldtTeam),
    });

    console.log('deployer balances', {
      ldt: await ldt.balanceOf(deployer),
      tbb: await tbb.balanceOf(deployer),
      tbs: await tbs.balanceOf(deployer),
      tbg: await tbg.balanceOf(deployer),
    });

    // await tbbFarm.harvest();
    // await tbsFarm.harvest();
    // await tbgFarm.harvest();

    await tbbStaker.harvest();
    await tbsStaker.harvest();
    await tbgStaker.harvest();

    // expect(await ldt.balanceOf(deployer)).eq(
    //   parseUnits('1', 18) + parseUnits('25', 18) + parseUnits('500', 18),
    // );

    // expect(await tbb.balanceOf(deployer)).eq(parseUnits('0.001', 18));
    // expect(await tbs.balanceOf(deployer)).eq(parseUnits('0.0025', 18));
    // expect(await tbg.balanceOf(deployer)).eq(parseUnits('0.005', 18));

    console.log('deployer balances', {
      ldt: await ldt.balanceOf(deployer),
      tbb: await tbb.balanceOf(deployer),
      tbs: await tbs.balanceOf(deployer),
      tbg: await tbg.balanceOf(deployer),
    });

    expect(await ldt.balanceOf(rewardSplitterAddress)).eq(0n);

    console.log('balance distributorAddress', await ldt.balanceOf(distributorAddress));
    console.log('balance rewardSplitterAddress', await ldt.balanceOf(rewardSplitterAddress));
  });

  it('owner should recover tbb ownership', async () => {
    const { rewardSplitter, rewardSplitterAddress, deployer, user, tbb, tbbAddress } = await rewardSplitterV2Fixture();

    expect(await tbb.owner()).eq(rewardSplitterAddress);

    await expect(rewardSplitter.connect(user).recoverOwnership(tbbAddress)).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');

    await rewardSplitter.recoverOwnership(tbbAddress);

    expect(await tbb.owner()).eq(deployer);
  });

  it('owner should recover tbs ownership', async () => {
    const { rewardSplitter, rewardSplitterAddress, deployer, user, tbs, tbsAddress } = await rewardSplitterV2Fixture();

    expect(await tbs.owner()).eq(rewardSplitterAddress);

    await expect(rewardSplitter.connect(user).recoverOwnership(tbsAddress)).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');

    await rewardSplitter.recoverOwnership(tbsAddress);

    expect(await tbs.owner()).eq(deployer);
  });

  it('owner should recover tbg ownership', async () => {
    const { rewardSplitter, rewardSplitterAddress, deployer, user, tbg, tbgAddress } = await rewardSplitterV2Fixture();

    expect(await tbg.owner()).eq(rewardSplitterAddress);

    await expect(rewardSplitter.connect(user).recoverOwnership(tbgAddress)).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');

    await rewardSplitter.recoverOwnership(tbgAddress);

    expect(await tbg.owner()).eq(deployer);
  });

  it('owner should recover tbb farm ownership', async () => {
    const {
      rewardSplitter,
      rewardSplitterAddress,
      deployer,
      user,
      tbbFarm,
      tbbFarmAddress,
    } = await rewardSplitterV2Fixture();

    expect(await tbbFarm.owner()).eq(rewardSplitterAddress);

    await expect(rewardSplitter.connect(user).recoverOwnership(tbbFarmAddress)).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');

    await rewardSplitter.recoverOwnership(tbbFarmAddress);

    expect(await tbbFarm.owner()).eq(deployer);
  });

  it('owner should recover tbs farm ownership', async () => {
    const {
      rewardSplitter,
      rewardSplitterAddress,
      deployer,
      user,
      tbsFarm,
      tbsFarmAddress,
    } = await rewardSplitterV2Fixture();

    expect(await tbsFarm.owner()).eq(rewardSplitterAddress);

    await expect(rewardSplitter.connect(user).recoverOwnership(tbsFarmAddress)).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');

    await rewardSplitter.recoverOwnership(tbsFarmAddress);

    expect(await tbsFarm.owner()).eq(deployer);
  });

  it('owner should recover tbg farm ownership', async () => {
    const {
      rewardSplitter,
      rewardSplitterAddress,
      deployer,
      user,
      tbgFarm,
      tbgFarmAddress,
    } = await rewardSplitterV2Fixture();

    expect(await tbgFarm.owner()).eq(rewardSplitterAddress);

    await expect(rewardSplitter.connect(user).recoverOwnership(tbgFarmAddress)).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');

    await rewardSplitter.recoverOwnership(tbgFarmAddress);

    expect(await tbgFarm.owner()).eq(deployer);
  });
});
