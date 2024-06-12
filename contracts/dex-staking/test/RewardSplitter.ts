import { rewardSplitterFixture } from '../fixtures';
import { expect } from 'chai';
import { formatUnits } from 'ethers';

describe('RewardSplitter', () => {
  it('must have ldt as reward token address', async () => {
    const { rewardSplitter, ldtAddress } = await rewardSplitterFixture();

    expect(await rewardSplitter.rewardToken()).eq(ldtAddress);
  });

  it('must calculate rewards', async () => {
    const {
      deployer,
      ldt,
      rewardSplitter,
      rewardSplitterAddress,
      tbb,
      tbbPair,
      tbbPairAddress,
      tbbStaker,
      tbbStakerAddress,
      tbg,
      tbgPair,
      tbgStaker,
      tbgStakerAddress,
      tbs,
      tbsPair,
      tbsStaker,
      tbsStakerAddress,
    } = await rewardSplitterFixture();

    console.log('LDT', await ldt.balanceOf(rewardSplitterAddress));

    // await tbbPair.approve(stakerAddress, 158n * 10n ** 18n);
    // await staker.stake(158n * 10n ** 18n);

    console.log('tbb pair', await tbbPair.balanceOf(deployer));

    await tbbPair.approve(tbbStakerAddress, await tbbPair.balanceOf(deployer));
    await tbbStaker.stake(await tbbPair.balanceOf(deployer));

    await tbsPair.approve(tbsStakerAddress, await tbsPair.balanceOf(deployer));
    await tbsStaker.stake(await tbsPair.balanceOf(deployer));

    await tbgPair.approve(tbgStakerAddress, await tbgPair.balanceOf(deployer));
    await tbgStaker.stake(await tbgPair.balanceOf(deployer));

    await rewardSplitter.approveTb();

    console.log('tbb pool', formatUnits(await tbb.balanceOf(tbbPairAddress), 18));
    console.log('tbb total staked', formatUnits(await tbbStaker.totalStaked(), 18));

    console.log('tb farm before', await tbb.balanceOf(tbbStakerAddress));
    console.log('ldt farm before', await ldt.balanceOf(tbbStakerAddress));

    console.log('tb farm before', await tbb.balanceOf(tbsStakerAddress));
    console.log('ldt farm before', await ldt.balanceOf(tbsStakerAddress));

    console.log('tb farm before', await tbb.balanceOf(tbgStakerAddress));
    console.log('ldt farm before', await ldt.balanceOf(tbgStakerAddress));

    const tx = await rewardSplitter.requestDistribution();

    console.log('tb farm after', formatUnits(await tbb.balanceOf(tbbStakerAddress), 18));
    console.log('ldt farm after', formatUnits(await ldt.balanceOf(tbbStakerAddress), 18));

    console.log('tb farm after', formatUnits(await tbs.balanceOf(tbsStakerAddress), 18));
    console.log('ldt farm after', formatUnits(await ldt.balanceOf(tbsStakerAddress), 18));

    console.log('tb farm after', formatUnits(await tbg.balanceOf(tbgStakerAddress), 18));
    console.log('ldt farm after', formatUnits(await ldt.balanceOf(tbgStakerAddress), 18));
  });

  it('owner should recover tbb ownership', async () => {
    const { rewardSplitter, rewardSplitterAddress, deployer, user, tbb } = await rewardSplitterFixture();

    expect(await tbb.owner()).eq(rewardSplitterAddress);

    await expect(rewardSplitter.connect(user).recoverOwnershipTbb()).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');

    await rewardSplitter.recoverOwnershipTbb();

    expect(await tbb.owner()).eq(deployer);
  });

  it('owner should recover tbs ownership', async () => {
    const { rewardSplitter, rewardSplitterAddress, deployer, user, tbs } = await rewardSplitterFixture();

    expect(await tbs.owner()).eq(rewardSplitterAddress);

    await expect(rewardSplitter.connect(user).recoverOwnershipTbs()).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');

    await rewardSplitter.recoverOwnershipTbs();

    expect(await tbs.owner()).eq(deployer);
  });

  it('owner should recover tbg ownership', async () => {
    const { rewardSplitter, rewardSplitterAddress, deployer, user, tbg } = await rewardSplitterFixture();

    expect(await tbg.owner()).eq(rewardSplitterAddress);

    await expect(rewardSplitter.connect(user).recoverOwnershipTbg()).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');

    await rewardSplitter.recoverOwnershipTbg();

    expect(await tbg.owner()).eq(deployer);
  });

  it('owner should recover tbb farm ownership', async () => {
    const { rewardSplitter, rewardSplitterAddress, deployer, user, tbbStaker } = await rewardSplitterFixture();

    expect(await tbbStaker.owner()).eq(rewardSplitterAddress);

    await expect(rewardSplitter.connect(user).recoverOwnershipTbbFarm()).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');

    await rewardSplitter.recoverOwnershipTbbFarm();

    expect(await tbbStaker.owner()).eq(deployer);
  });

  it('owner should recover tbs farm ownership', async () => {
    const { rewardSplitter, rewardSplitterAddress, deployer, user, tbsStaker } = await rewardSplitterFixture();

    expect(await tbsStaker.owner()).eq(rewardSplitterAddress);

    await expect(rewardSplitter.connect(user).recoverOwnershipTbsFarm()).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');

    await rewardSplitter.recoverOwnershipTbsFarm();

    expect(await tbsStaker.owner()).eq(deployer);
  });

  it('owner should recover tbg farm ownership', async () => {
    const { rewardSplitter, rewardSplitterAddress, deployer, user, tbgStaker } = await rewardSplitterFixture();

    expect(await tbgStaker.owner()).eq(rewardSplitterAddress);

    await expect(rewardSplitter.connect(user).recoverOwnershipTbgFarm()).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');

    await rewardSplitter.recoverOwnershipTbgFarm();

    expect(await tbgStaker.owner()).eq(deployer);
  });

  it('owner should set a new tbb reward rate', async () => {
    const { rewardSplitter } = await rewardSplitterFixture();

    let rate = await rewardSplitter.tbbRewardRate()

    expect(rate.ldt).eq(10n);
    expect(rate.tb).eq(10n);

    await expect(rewardSplitter.setTbbRewardRate(0n, 1n)).revertedWith('INVALID_LDT_RATE');
    await expect(rewardSplitter.setTbbRewardRate(10001n, 1n)).revertedWith('INVALID_LDT_RATE');

    await expect(rewardSplitter.setTbbRewardRate(1n, 0n)).revertedWith('INVALID_TB_RATE');
    await expect(rewardSplitter.setTbbRewardRate(1n, 10001n)).revertedWith('INVALID_TB_RATE');

    await rewardSplitter.setTbbRewardRate(1n, 10000n);

    rate = await rewardSplitter.tbbRewardRate();

    expect(rate.ldt).eq(1n);
    expect(rate.tb).eq(10000n);
  });

  it('owner should set a new tbs reward rate', async () => {
    const { rewardSplitter } = await rewardSplitterFixture();

    let rate = await rewardSplitter.tbsRewardRate()

    expect(rate.ldt).eq(10n);
    expect(rate.tb).eq(10n);

    await expect(rewardSplitter.setTbsRewardRate(0n, 1n)).revertedWith('INVALID_LDT_RATE');
    await expect(rewardSplitter.setTbsRewardRate(10001n, 1n)).revertedWith('INVALID_LDT_RATE');

    await expect(rewardSplitter.setTbsRewardRate(1n, 0n)).revertedWith('INVALID_TB_RATE');
    await expect(rewardSplitter.setTbsRewardRate(1n, 10001n)).revertedWith('INVALID_TB_RATE');

    await rewardSplitter.setTbsRewardRate(1n, 10000n);

    rate = await rewardSplitter.tbsRewardRate();

    expect(rate.ldt).eq(1n);
    expect(rate.tb).eq(10000n);
  });

  it('owner should set a new tbg reward rate', async () => {
    const { rewardSplitter } = await rewardSplitterFixture();

    let rate = await rewardSplitter.tbgRewardRate()

    expect(rate.ldt).eq(10n);
    expect(rate.tb).eq(10n);

    await expect(rewardSplitter.setTbgRewardRate(0n, 1n)).revertedWith('INVALID_LDT_RATE');
    await expect(rewardSplitter.setTbgRewardRate(10001n, 1n)).revertedWith('INVALID_LDT_RATE');

    await expect(rewardSplitter.setTbgRewardRate(1n, 0n)).revertedWith('INVALID_TB_RATE');
    await expect(rewardSplitter.setTbgRewardRate(1n, 10001n)).revertedWith('INVALID_TB_RATE');

    await rewardSplitter.setTbgRewardRate(1n, 10000n);

    rate = await rewardSplitter.tbgRewardRate();

    expect(rate.ldt).eq(1n);
    expect(rate.tb).eq(10000n);
  });
});
