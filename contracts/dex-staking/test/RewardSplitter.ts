import { rewardSplitterFixture } from '../fixtures';
import { expect } from 'chai';
import { formatUnits } from 'ethers';

describe('RewardSplitter', () => {
  it('must have ldt as reward token address', async () => {
    const { rewardSplitter, ldtAddress } = await rewardSplitterFixture();

    expect(await rewardSplitter.rewardToken()).eq(ldtAddress);
  });

  it('must calculate rewards', async () => {
    const { rewardSplitter, staker, tbbPair, stakerAddress } = await rewardSplitterFixture();

    await rewardSplitter.addFarm(stakerAddress);

    await tbbPair.approve(stakerAddress, 100n * 10n ** 18n);
    await staker.stake(100n * 10n ** 18n);

    const liq = await rewardSplitter.calculateStakingLiquidity(await rewardSplitter.farms(0))

    console.log('farms', await rewardSplitter.farms(0))
    console.log('farms', formatUnits(liq[0], 18), formatUnits(liq[1], 18))
  })
});
