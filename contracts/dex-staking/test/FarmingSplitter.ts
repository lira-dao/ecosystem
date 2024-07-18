import { rewardSplitterV2Fixture } from '../fixtures';
import { expect } from 'chai';
import { parseUnits } from 'ethers';

describe('FarmingSplitter', () => {
  it('should have ldt address', async () => {
    const { farmingSplitter, ldtAddress } = await rewardSplitterV2Fixture();

    expect(await farmingSplitter.ldt()).eq(ldtAddress);
  });

  it('should have tbb address', async () => {
    const { farmingSplitter, tbbAddress } = await rewardSplitterV2Fixture();

    expect(await farmingSplitter.tbb()).eq(tbbAddress);
  });

  it('should have tbs address', async () => {
    const { farmingSplitter, tbsAddress } = await rewardSplitterV2Fixture();

    expect(await farmingSplitter.tbs()).eq(tbsAddress);
  });

  it('should have tbg address', async () => {
    const { farmingSplitter, tbgAddress } = await rewardSplitterV2Fixture();

    expect(await farmingSplitter.tbg()).eq(tbgAddress);
  });

  it('should have farms address', async () => {
    const { farmingSplitter, tbbFarmAddress, tbsFarmAddress, tbgFarmAddress } = await rewardSplitterV2Fixture();

    expect(await farmingSplitter.farms(0)).eq(tbbFarmAddress);
    expect(await farmingSplitter.farms(1)).eq(tbsFarmAddress);
    expect(await farmingSplitter.farms(2)).eq(tbgFarmAddress);
  });


  it('should have tbb reward rate', async () => {
    const { farmingSplitter } = await rewardSplitterV2Fixture();

    let rewardRate = await farmingSplitter.tbbRewardRate();

    expect(rewardRate[0]).eq(200);
    expect(rewardRate[1]).eq(200);

    await expect(farmingSplitter.setTbbRewardRate({ ldt: 300, tb: 400 })).not.reverted;

    rewardRate = await farmingSplitter.tbbRewardRate();

    expect(rewardRate[0]).eq(300);
    expect(rewardRate[1]).eq(400);
  });

  it('should have tbs reward rate', async () => {
    const { farmingSplitter } = await rewardSplitterV2Fixture();

    let rewardRate = await farmingSplitter.tbsRewardRate();

    expect(rewardRate[0]).eq(500);
    expect(rewardRate[1]).eq(500);

    await expect(farmingSplitter.setTbsRewardRate({ ldt: 600, tb: 700 })).not.reverted;

    rewardRate = await farmingSplitter.tbsRewardRate();

    expect(rewardRate[0]).eq(600);
    expect(rewardRate[1]).eq(700);
  });

  it('should have tbg reward rate', async () => {
    const { farmingSplitter } = await rewardSplitterV2Fixture();

    let rewardRate = await farmingSplitter.tbgRewardRate();

    expect(rewardRate[0]).eq(1000);
    expect(rewardRate[1]).eq(1000);

    await expect(farmingSplitter.setTbgRewardRate({ ldt: 2000, tb: 3000 })).not.reverted;

    rewardRate = await farmingSplitter.tbgRewardRate();

    expect(rewardRate[0]).eq(2000);
    expect(rewardRate[1]).eq(3000);
  });


  it('should have min rate', async () => {
    const { farmingSplitter } = await rewardSplitterV2Fixture();

    expect(await farmingSplitter.MIN_RATE()).eq(1);
  });

  it('should have max rate', async () => {
    const { farmingSplitter } = await rewardSplitterV2Fixture();

    expect(await farmingSplitter.MAX_RATE()).eq(100_000);
  });

  it('should calculate', async () => {
    const { farmingSplitter } = await rewardSplitterV2Fixture();

    const rewards = await farmingSplitter.calculate(parseUnits('221917.8'), parseUnits('1775342.4'));
  });
});
