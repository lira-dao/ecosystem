import { rewardSplitterV2Factory } from '../fixtures';
import { expect } from 'chai';

describe('RewardSplitterV2', () => {
  it('should have ldt address', async () => {
    const { rewardSplitter, ldtAddress } = await rewardSplitterV2Factory();

    expect(await rewardSplitter.ldt()).eq(ldtAddress);
  });

  it('should have tbb address', async () => {
    const { rewardSplitter, tbbAddress } = await rewardSplitterV2Factory();

    expect(await rewardSplitter.tbb()).eq(tbbAddress);
  });

  it('should have tbs address', async () => {
    const { rewardSplitter, tbsAddress } = await rewardSplitterV2Factory();

    expect(await rewardSplitter.tbs()).eq(tbsAddress);
  });

  it('should have tbg address', async () => {
    const { rewardSplitter, tbgAddress } = await rewardSplitterV2Factory();

    expect(await rewardSplitter.tbg()).eq(tbgAddress);
  });

  it('should have distributor address', async () => {
    const { rewardSplitter, distributorAddress } = await rewardSplitterV2Factory();

    expect(await rewardSplitter.distributor()).eq(distributorAddress);
  });

  it('should calculate total rewards', async () => {
    const {
      rewardSplitter,
      rewardSplitterAddress,
      ldt,
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
    } = await rewardSplitterV2Factory();

    console.log('LP', {
      tbb: await tbbPair.balanceOf(deployer),
      tbs: await tbsPair.balanceOf(deployer),
      tbg: await tbgPair.balanceOf(deployer),
    });

    await tbbPair.approve(tbbFarmAddress, await tbbPair.balanceOf(deployer));
    await tbbFarm.stake(await tbbPair.balanceOf(deployer));

    await tbsPair.approve(tbsFarmAddress, await tbsPair.balanceOf(deployer));
    await tbsFarm.stake(await tbsPair.balanceOf(deployer));

    await tbgPair.approve(tbgFarmAddress, await tbgPair.balanceOf(deployer));
    await tbgFarm.stake(await tbgPair.balanceOf(deployer));

    await expect(rewardSplitter.distributeRewards())
      .emit(rewardSplitter, 'DistributeRewards')
      .withArgs([
        5_547_945_000_000_000_000_000_000n, // total
        1_109_589_000_000_000_000_000_000n, // ldt 20%
        4_438_356_000_000_000_000_000_000n, // tb 80%
        [221917800000000000000000n, 1_775_342_400_000_000_000_000_000n], // farming
        [443_835_600_000_000_000_000_000n, 1_109_589_000_000_000_000_000_000n], // staking
        [110_958_900_000_000_000_000_000n, 443_835_600_000_000_000_000_000n], // team
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
            0,
          ],
          [
            [9999999999999999996837n, 99999999999999999n, 999999999999999999683772n, 9999999999999999996n],
            73972600000000000000000n,
            0,
          ],
        ],
      );

    await ldt.burn(await ldt.balanceOf(deployer));

    console.log('deployer balances', {
      ldt: await ldt.balanceOf(deployer),
      tbb: await tbb.balanceOf(deployer),
      tbs: await tbs.balanceOf(deployer),
      tbg: await tbg.balanceOf(deployer),
    });

    await tbbFarm.harvest();
    //await tbsFarm.harvest();
    //await tbgFarm.harvest();

    console.log('deployer balances', {
      ldt: await ldt.balanceOf(deployer),
      tbb: await tbb.balanceOf(deployer),
      tbs: await tbs.balanceOf(deployer),
      tbg: await tbg.balanceOf(deployer),
    });

    console.log('balance distributorAddress', await ldt.balanceOf(distributorAddress));
    console.log('balance rewardSplitterAddress', await ldt.balanceOf(rewardSplitterAddress));
  });
});
