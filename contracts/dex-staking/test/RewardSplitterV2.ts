import { rewardSplitterV2Fixture, rewardSplitterV2FixtureWithStake } from '../fixtures';
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
      tbbPair,
      tbs,
      tbsPair,
      tbg,
      tbgPair,
      deployer,
      tbbStaker,
      tbsStaker,
      tbgStaker,
      tbbBooster,
      tbsBooster,
      tbgBooster,
    } = await rewardSplitterV2FixtureWithStake();

    await expect(rewardSplitter.distributeRewards())
      .emit(rewardSplitter, 'DistributeRewards')
      .withArgs([
        5_547_945_000_000_000_000_000_000n, // total
        1_109_589_000_000_000_000_000_000n, // ldt 20%
        4_438_356_000_000_000_000_000_000n, // tb 80%
        [parseUnits('221917.8', 18), parseUnits('1775342.4', 18)], // farming
        [parseUnits('221917.8', 18), parseUnits('554794.5', 18)], // staking
        [parseUnits('221917.8', 18), parseUnits('554794.5', 18)], // booster
        [parseUnits('110958.9', 18), parseUnits('443835.6', 18)], // team
      ])
      .emit(rewardSplitter, 'DistributeFarmingRewards')
      .withArgs(
        [
          [
            [1999999999999999999936n, 1999999999999999999n, 999999999999999999968377n, 999999999999999999968n],
            73_972_600_000_000_000_000_000n,
            1999999999999999999n,
          ],
          [
            [4999999999999999999500n, 499999999999999999n, 999999999999999999900000n, 99999999999999999990n],
            73972600000000000000000n,
            499999999999999999n,
          ],
          [
            [9999999999999999996837n, 99999999999999999n, 999999999999999999683772n, 9999999999999999996n],
            73972600000000000000000n,
            99999999999999999n,
          ],
        ],
      )
      .emit(rewardSplitter, 'DistributeStakingRewards')
      .withArgs(
        [
          [
            [parseUnits('1', 18), parseUnits('0.001', 18), parseUnits('500', 18), parseUnits('0.5', 18)],
            parseUnits('1', 18),
            parseUnits('0.001', 18),
          ],
          [
            [parseUnits('25', 18), parseUnits('0.0025', 18), parseUnits('5000', 18), parseUnits('0.5', 18)],
            parseUnits('25', 18),
            parseUnits('0.0025', 18),
          ],
          [
            [parseUnits('500', 18), parseUnits('0.005', 18), parseUnits('50000', 18), parseUnits('0.5', 18)],
            parseUnits('500', 18),
            parseUnits('0.005', 18),
          ],
        ],
      )
      .emit(rewardSplitter, 'DistributeBoostingRewards')
      .withArgs(
        [
          [
            [parseUnits('1'), parseUnits('0.001'), parseUnits('500', 18), parseUnits('0.5')],
            parseUnits('1'),
            parseUnits('0.001'),
          ],
          [
            [parseUnits('25', 18), parseUnits('0.0025', 18), parseUnits('5000', 18), parseUnits('0.5', 18)],
            parseUnits('25', 18),
            parseUnits('0.0025', 18),
          ],
          [
            [parseUnits('500', 18), parseUnits('0.005', 18), parseUnits('50000', 18), parseUnits('0.5', 18)],
            parseUnits('500', 18),
            parseUnits('0.005', 18),
          ],
        ],
      )
      .emit(rewardSplitter, 'DistributeTeamRewards')
      .withArgs(
        [
          30554999999999999995521n,
          10004999999999999999n,
          1004999999999999999n,
          104999999999999999n,
        ],
      );

    await tbbStaker.harvest();
    await tbbBooster.harvest();

    await tbsStaker.harvest();
    await tbsBooster.harvest();

    await tbgStaker.harvest();
    await tbgBooster.harvest();

    await tbbBooster.unstake(parseUnits('500', 18));
    await tbbStaker.unstake(parseUnits('1', 18));

    await tbsBooster.unstake(parseUnits('5000', 18));
    await tbsStaker.unstake(parseUnits('1', 18));

    await tbgBooster.unstake(parseUnits('50000', 18));
    await tbgStaker.unstake(parseUnits('1', 18));

    await tbb.transfer(ldtTeam, await tbb.balanceOf(deployer));
    await tbs.transfer(ldtTeam, await tbs.balanceOf(deployer));
    await tbg.transfer(ldtTeam, await tbg.balanceOf(deployer));

    await tbb.mint(deployer, parseUnits('20', 18));
    await tbbStaker.stake(parseUnits('20', 18));
    await tbbBooster.stake(parseUnits('10000', 18));

    await tbs.mint(deployer, parseUnits('20', 18));
    await tbsStaker.stake(parseUnits('20', 18));
    await tbsBooster.stake(parseUnits('100000', 18));

    await tbg.mint(deployer, parseUnits('1', 18));
    await tbgStaker.stake(parseUnits('1', 18));
    await tbgBooster.stake(parseUnits('50000', 18));

    await expect(rewardSplitter.distributeRewards())
      .emit(rewardSplitter, 'DistributeRewards')
      .withArgs([
        5_547_945_000_000_000_000_000_000n, // total
        1_109_589_000_000_000_000_000_000n, // ldt 20%
        4_438_356_000_000_000_000_000_000n, // tb 80%
        [parseUnits('221917.8', 18), parseUnits('1775342.4', 18)], // farming
        [parseUnits('221917.8', 18), parseUnits('554794.5', 18)], // staking
        [parseUnits('221917.8', 18), parseUnits('554794.5', 18)], // booster
        [parseUnits('110958.9', 18), parseUnits('443835.6', 18)], // team
      ])
      .emit(rewardSplitter, 'DistributeStakingRewards')
      .withArgs(
        [
          [
            [parseUnits('20'), parseUnits('0.02'), parseUnits('10000'), parseUnits('10')],
            20000000000000000000n,
            20000000000000000n,
          ],
          [
            [500000000000000000000n, 50000000000000000n, 100000000000000000000000n, 10000000000000000000n],
            500000000000000000000n,
            50000000000000000n,
          ],
          [
            [500000000000000000000n, 5000000000000000n, 50000000000000000000000n, 500000000000000000n],
            500000000000000000000n,
            5000000000000000n,
          ],
        ],
      );

    // expect(await ldt.balanceOf(deployer)).eq(
    //   parseUnits('1', 18) + parseUnits('25', 18) + parseUnits('500', 18),
    // );

    // expect(await tbb.balanceOf(deployer)).eq(parseUnits('0.001', 18));
    // expect(await tbs.balanceOf(deployer)).eq(parseUnits('0.0025', 18));
    // expect(await tbg.balanceOf(deployer)).eq(parseUnits('0.005', 18));

    expect(await ldt.balanceOf(rewardSplitterAddress)).eq(0n);
  });

  it('should not unstake if boost is active', async () => {
    const {
      tbb,
      deployer,
      tbbStaker,
      tbbBooster,
    } = await rewardSplitterV2Fixture();

    await tbb.mint(deployer, parseUnits('1', 18));
    await tbbStaker.stake(parseUnits('1', 18));

    expect(await tbbBooster.getMaxBoost(deployer)).eq(parseUnits('500'));
    expect(await tbbBooster.getRemainingBoost(deployer)).eq(parseUnits('500'));

    await tbbBooster.stake(parseUnits('250', 18));

    await tbbBooster.getRemainingBoost(deployer);

    expect(await tbbBooster.getRemainingBoost(deployer)).eq(parseUnits('250'));

    await expect(tbbStaker.unstake(parseUnits('0.5'))).not.reverted;

    await expect(tbbStaker.unstake(parseUnits('0.5'))).revertedWith('INVALID_BOOST_AMOUNT');
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
