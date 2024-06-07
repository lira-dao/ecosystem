import { rewardSplitterFixture } from '../fixtures';
import { expect } from 'chai';

describe('RewardSplitter', () => {
  it('must have ldt as reward token address', async () => {
    const { rewardSplitter, ldtAddress } = await rewardSplitterFixture();

    expect(await rewardSplitter.rewardToken()).eq(ldtAddress);
  });
});
