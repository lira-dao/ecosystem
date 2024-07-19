import { rewardSplitterV2Fixture, rewardSplitterV2FixtureWithStake } from '../fixtures';
import { expect } from 'chai';
import { parseUnits } from 'ethers';

describe('TeamSplitter', () => {
  it('should have tbb address', async () => {
    const { teamSplitter, tbbAddress } = await rewardSplitterV2Fixture();

    expect(await teamSplitter.tbb()).eq(tbbAddress);
  });

  it('should have tbs address', async () => {
    const { teamSplitter, tbsAddress } = await rewardSplitterV2Fixture();

    expect(await teamSplitter.tbs()).eq(tbsAddress);
  });

  it('should have tbg address', async () => {
    const { teamSplitter, tbgAddress } = await rewardSplitterV2Fixture();

    expect(await teamSplitter.tbg()).eq(tbgAddress);
  });

  it('should have a reward rate', async () => {
    const { teamSplitter } = await rewardSplitterV2Fixture();

    let rewardRate = await teamSplitter.rewardRate();

    expect(rewardRate[0]).eq(1000);
    expect(rewardRate[1]).eq(1000);

    await expect(teamSplitter.setRewardRate({ ldt: 300, tb: 400 })).not.reverted;

    rewardRate = await teamSplitter.rewardRate();

    expect(rewardRate[0]).eq(300);
    expect(rewardRate[1]).eq(400);
  });

  it('should have min rate', async () => {
    const { teamSplitter } = await rewardSplitterV2Fixture();

    expect(await teamSplitter.MIN_RATE()).eq(1);
  });

  it('should have max rate', async () => {
    const { teamSplitter } = await rewardSplitterV2Fixture();

    expect(await teamSplitter.MAX_RATE()).eq(100_000);
  });

  it('should calculate', async () => {
    const { teamSplitter } = await rewardSplitterV2FixtureWithStake();

    const rewards = await teamSplitter.calculate(parseUnits('110958.9', 18), 3055499999999999999552149n, parseUnits('443835.6', 18), 1000499999999999999968n, 100499999999999999990n, 10499999999999999996n);

    expect(rewards.ldt).eq(30554999999999999995521n);
    expect(rewards.tbb).eq(10004999999999999999n);
    expect(rewards.tbs).eq(1004999999999999999n);
    expect(rewards.tbg).eq(104999999999999999n);
  });
});
