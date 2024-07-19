import { rewardSplitterV2Fixture, rewardSplitterV2FixtureWithStake } from '../fixtures';
import { expect } from 'chai';
import { parseUnits } from 'ethers';

describe('BoostingSplitter', () => {
  it('should have ldt address', async () => {
    const { boostingSplitter, ldtAddress } = await rewardSplitterV2Fixture();

    expect(await boostingSplitter.ldt()).eq(ldtAddress);
  });

  it('should have tbb address', async () => {
    const { boostingSplitter, tbbAddress } = await rewardSplitterV2Fixture();

    expect(await boostingSplitter.tbb()).eq(tbbAddress);
  });

  it('should have tbs address', async () => {
    const { boostingSplitter, tbsAddress } = await rewardSplitterV2Fixture();

    expect(await boostingSplitter.tbs()).eq(tbsAddress);
  });

  it('should have tbg address', async () => {
    const { boostingSplitter, tbgAddress } = await rewardSplitterV2Fixture();

    expect(await boostingSplitter.tbg()).eq(tbgAddress);
  });

  it('should have farms address', async () => {
    const { boostingSplitter, tbbBoosterAddress, tbsBoosterAddress, tbgBoosterAddress } = await rewardSplitterV2Fixture();

    expect(await boostingSplitter.boosters(0)).eq(tbbBoosterAddress);
    expect(await boostingSplitter.boosters(1)).eq(tbsBoosterAddress);
    expect(await boostingSplitter.boosters(2)).eq(tbgBoosterAddress);
  });

  it('should have tbb reward rate', async () => {
    const { boostingSplitter } = await rewardSplitterV2Fixture();

    let rewardRate = await boostingSplitter.tbbRewardRate();

    expect(rewardRate[0]).eq(200);
    expect(rewardRate[1]).eq(200);

    await expect(boostingSplitter.setTbbRewardRate({ ldt: 300, tb: 400 })).not.reverted;

    rewardRate = await boostingSplitter.tbbRewardRate();

    expect(rewardRate[0]).eq(300);
    expect(rewardRate[1]).eq(400);
  });

  it('should have tbs reward rate', async () => {
    const { boostingSplitter } = await rewardSplitterV2Fixture();

    let rewardRate = await boostingSplitter.tbsRewardRate();

    expect(rewardRate[0]).eq(500);
    expect(rewardRate[1]).eq(500);

    await expect(boostingSplitter.setTbsRewardRate({ ldt: 600, tb: 700 })).not.reverted;

    rewardRate = await boostingSplitter.tbsRewardRate();

    expect(rewardRate[0]).eq(600);
    expect(rewardRate[1]).eq(700);
  });

  it('should have tbg reward rate', async () => {
    const { boostingSplitter } = await rewardSplitterV2Fixture();

    let rewardRate = await boostingSplitter.tbgRewardRate();

    expect(rewardRate[0]).eq(1000);
    expect(rewardRate[1]).eq(1000);

    await expect(boostingSplitter.setTbgRewardRate({ ldt: 2000, tb: 3000 })).not.reverted;

    rewardRate = await boostingSplitter.tbgRewardRate();

    expect(rewardRate[0]).eq(2000);
    expect(rewardRate[1]).eq(3000);
  });


  it('should have min rate', async () => {
    const { boostingSplitter } = await rewardSplitterV2Fixture();

    expect(await boostingSplitter.MIN_RATE()).eq(1);
  });

  it('should have max rate', async () => {
    const { boostingSplitter } = await rewardSplitterV2Fixture();

    expect(await boostingSplitter.MAX_RATE()).eq(100_000);
  });

  it('should calculate', async () => {
    const { boostingSplitter } = await rewardSplitterV2FixtureWithStake();

    const rewards = await boostingSplitter.calculate(parseUnits('221917.8'), parseUnits('1775342.4'));

    expect(rewards.tbb.liquidity.ldt).eq(1000000000000000000n);
    expect(rewards.tbb.liquidity.tb).eq(1000000000000000n);
    expect(rewards.tbb.liquidity.ldtLiquidity).eq(500000000000000000000n);
    expect(rewards.tbb.liquidity.tbLiquidity).eq(500000000000000000n);

    expect(rewards.tbb.ldt).eq(1000000000000000000n);
    expect(rewards.tbb.tb).eq(1000000000000000n);

    expect(rewards.tbs.liquidity.ldt).eq(25000000000000000000n);
    expect(rewards.tbs.liquidity.tb).eq(2500000000000000n);
    expect(rewards.tbs.liquidity.ldtLiquidity).eq(5000000000000000000000n);
    expect(rewards.tbs.liquidity.tbLiquidity).eq(500000000000000000n);

    expect(rewards.tbs.ldt).eq(25000000000000000000n);
    expect(rewards.tbs.tb).eq(2500000000000000n);

    expect(rewards.tbg.liquidity.ldt).eq(500000000000000000000n);
    expect(rewards.tbg.liquidity.tb).eq(5000000000000000n);
    expect(rewards.tbg.liquidity.ldtLiquidity).eq(50000000000000000000000n);
    expect(rewards.tbg.liquidity.tbLiquidity).eq(500000000000000000n);

    expect(rewards.tbg.ldt).eq(500000000000000000000n);
    expect(rewards.tbg.tb).eq(5000000000000000n);
  });
});
