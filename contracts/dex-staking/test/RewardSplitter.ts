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

    await rewardSplitter.requestDistribution();

    console.log('tb farm after', formatUnits(await tbb.balanceOf(tbbStakerAddress), 18));
    console.log('ldt farm after', formatUnits(await ldt.balanceOf(tbbStakerAddress), 18));

    console.log('tb farm after', formatUnits(await tbs.balanceOf(tbsStakerAddress), 18));
    console.log('ldt farm after', formatUnits(await ldt.balanceOf(tbsStakerAddress), 18));

    console.log('tb farm after', formatUnits(await tbg.balanceOf(tbgStakerAddress), 18));
    console.log('ldt farm after', formatUnits(await ldt.balanceOf(tbgStakerAddress), 18));
  });
});
