import { lpStakerFixture } from '../fixtures';
import { expect } from 'chai';


describe('LPStaker', () => {
  it('must have an lp token address', async () => {
    const { staker, tbbPairAddress } = await lpStakerFixture();

    expect(await staker.lpToken()).eq(tbbPairAddress);
  });

  it('must have a reward token addresses', async () => {
    const { staker, ldtAddress, tbbAddress } = await lpStakerFixture();

    expect(await staker.rewardToken1()).eq(ldtAddress);
    expect(await staker.rewardToken2()).eq(tbbAddress);
  });

  it('starker must return staker data', async () => {
    const { staker, stakerAddress, tbbPair, deployer } = await lpStakerFixture();

    console.log('asdasd', await tbbPair.balanceOf(deployer));

    await tbbPair.approve(stakerAddress, 10n ** 18n);

    await staker.stake(10n ** 18n);

    const stakerData = await staker.stakers(deployer);

    expect(stakerData.length).eq(2);
    expect(stakerData[0]).eq(10n ** 18n);
    expect(stakerData[1]).eq(0n);
  });

  it('must a have a total staked amount', async () => {
    const { staker, stakerAddress, tbbPair } = await lpStakerFixture();

    expect(await staker.totalStaked()).eq(0n);

    await tbbPair.approve(stakerAddress, 10n ** 18n);

    await staker.stake(10n ** 18n);

    expect(await staker.totalStaked()).eq(10n ** 18n);
  });

  it('must add a new round when rewards are distributed', async () => {
    const { staker, stakerAddress, ldt, tbb, tbbPair, deployer } = await lpStakerFixture();

    expect(await staker.totalStaked()).eq(0n);

    await tbbPair.approve(stakerAddress, 10n ** 18n);

    await staker.stake(10n ** 18n);

    await tbb.mint(deployer, 10n ** 18n);

    console.log('balance', await ldt.balanceOf(deployer), await tbb.balanceOf(deployer));

    await staker.distributeRewards(10n ** 18n, 10n ** 5n);

    const round = await staker.rewardRounds(0n, 1n);

    expect(await staker.rewardRounds(0n, 0n)).eq(10n ** 18n * 10n ** 18n);
    expect(await staker.rewardRounds(0n, 1n)).eq(10n ** 5n * 10n ** 18n);
  });

  it('must stake, unstake and distribute rewards', async () => {
    const { staker, stakerAddress, tbb, tbbPair, deployer } = await lpStakerFixture();

    expect(await staker.totalStaked()).eq(0n);

    await tbbPair.approve(stakerAddress, 10n ** 18n);

    await expect(staker.stake(10n ** 18n)).to.emit(staker, 'Stake').withArgs(deployer, 10n ** 18n);

    await tbb.mint(deployer, 10n ** 20n);

    for (let i = 0; i < 100; i++) {
      await staker.distributeRewards(10n ** 18n, 10n ** 5n);
    }

    await expect(staker.stake(10n ** 18n)).revertedWith('PENDING_REWARDS');
    await expect(staker.unstake(10n ** 18n)).revertedWith('PENDING_REWARDS');

    await expect(staker.harvest()).to.emit(staker, 'Harvest').withArgs(deployer, 10n ** 20n, 10n ** 7n);

    await expect(staker.unstake(10n ** 18n)).to.emit(staker, 'Unstake').withArgs(deployer, 10n ** 18n);
  });
});
