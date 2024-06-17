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

  it('user can stake and unstake lp token');

  it('must distribute rewards');

  it('user can harvest rewards');

  it('must revert if user tries to increase stake with pending rewards');

  it('must revert if user tries to decrease stake with pending rewards');

  it('must distribute staking rewards', async () => {
    const { staker, stakerAddress, ldt, tbb, tbbPair, deployer } = await lpStakerFixture();

    expect(await staker.totalStaked()).eq(0n);

    await tbbPair.approve(stakerAddress, 10n ** 18n);

    await staker.stake(10n ** 18n);

    await tbb.mint(deployer, 10n ** 20n);

    for (let i = 0; i < 100; i++) {
      await staker.distributeRewards(10n ** 18n, 10n ** 5n);
    }

    await staker.harvest();
    console.log('pendingRewards', await staker.pendingRewards(deployer));

    // await staker.connect(user1).stake(10n ** 10n);
    // await staker.connect(user2).stake(10n ** 10n);
    // await staker.connect(user3).stake(10n ** 10n);
    //
    // await staker.distributeRewards(10n ** 18n, 10n ** 18n);
    //
    // await staker.connect(user1).harvest();
    // await staker.connect(user2).harvest();
    // await staker.connect(user3).harvest();
    //
    // console.log('balance1', await ldt.balanceOf(stakerAddress));
    // console.log('balance2', await tbb.balanceOf(stakerAddress));

    // console.log('staker1', await staker.stakers(user1));
    //
    // // console.log('distribute rewards', 10n ** 18n, 10n ** 18n);
    // await staker.distributeRewards(10n ** 18n, 10n ** 18n);
    //
    // await staker.connect(user1).harvest();
    // await staker.connect(user1).unstake(10n ** 18n);
    //
    // await staker.connect(user2).stake(10n ** 18n);
    //
    // await staker.distributeRewards(10n ** 18n, 10n ** 18n);
    // await staker.distributeRewards(10n ** 18n, 10n ** 18n);
    // await staker.distributeRewards(10n ** 18n, 10n ** 18n);

    // console.log('pending', await staker.pendingRewards(user2));

    // console.log('pending rewards user1', await staker.stakers(user1));

    // await staker.connect(user2).stake(10n ** 18n);

    // console.log('total staked', await staker.totalStaked());
    // console.log('s1 a', await staker.stakers(user1));
    // console.log('s2 a', await staker.stakers(user2));
    // console.log();
    //
    // await staker.connect(user1).harvest();
    //
    // console.log('s1 b', await staker.stakers(user1));
    // console.log('s2 b', await staker.stakers(user2));
    // console.log();

    // await staker.distributeRewards(10n ** 17n, 30n);

    //
    // console.log('s1 c', await staker.stakers(user1));
    // console.log('s1 c', await staker.stakers(user2));
    // console.log();

    // for (let i = 0; i < 10000; i++) {
    //   await staker.distributeRewards(10n ** 10n, 10n ** 10n);
    // }
    //
    // await staker.connect(user1).harvest();

    //
    // const tx2 = await staker.connect(user2).harvest();
    // const receipt2 = await tx2.wait();
    // const gasCostForTxn2 = receipt2?.gasUsed || 0n * (receipt2?.gasPrice || 0n);
    // console.log('gasCostForTxn:', { gasUsed: receipt2?.gasUsed, gasPrice: receipt2?.gasPrice, gasCostForTxn2 });
    //
    // await staker.distributeRewards(10n ** 17n, 30n);
    // await staker.distributeRewards(10n ** 17n, 30n);
    // await staker.connect(user1).harvest();
    //
    // await staker.distributeRewards(10n ** 17n, 30n);
    // await staker.distributeRewards(10n ** 17n, 30n);
    // await staker.distributeRewards(10n ** 17n, 30n);
    // await staker.distributeRewards(10n ** 17n, 30n);
    // await staker.connect(user1).harvest();

    // const tx3 = await staker.connect(user1).harvest();
    // const receipt3 = await tx3.wait();
    // const gasCostForTxn3 = receipt3?.gasUsed || 0n * (receipt3?.gasPrice || 0n);
    // console.log('gasCostForTxn:', { gasUsed: receipt3?.gasUsed, gasPrice: receipt3?.gasPrice, gasCostForTxn3 });
    //
    // const tx4 = await staker.connect(user1).harvest();
    // const receipt4 = await tx4.wait();
    // const gasCostForTxn4 = receipt4?.gasUsed || 0n * (receipt4?.gasPrice || 0n);
    // console.log('gasCostForTxn:', { gasUsed: receipt4?.gasUsed, gasPrice: receipt4?.gasPrice, gasCostForTxn4 });

    // const trans = await staker.distributeRewards(10n ** 18n, 10n ** 18n);
    // const receipt = await trans.wait()
    // const gasCostForTxn = receipt?.gasUsed || 0n * (receipt?.gasPrice || 0n)
    // console.log('gasCostForTxn:', { gasUsed: receipt?.gasUsed, gasPrice: receipt?.gasPrice, gasCostForTxn })
    // console.log('staker1 c', await staker.pendingRewards(user1));
    // console.log('staker2 c', await staker.pendingRewards(user2));
  });

  // it('must distribute rewards to multiple wallets', async () => {
  //   const { staker, stakerAddress, lp, token1, token2, owner, user1, user2 } = await lpStakerFixture();
  //
  //   await token1.mint(owner, 10n ** 20n);
  //   await token2.mint(owner, 10n ** 20n);
  //
  //   await token1.approve(stakerAddress, 10n ** 20n);
  //   await token2.approve(stakerAddress, 10n ** 20n);
  //
  //   for (let i = 0; i < 10; i++) {
  //     const wallet = new hre.ethers.Wallet(wallets[i].privateKey, hre.ethers.provider);
  //
  //     await owner.sendTransaction({
  //       to: wallet.address,
  //       value: parseEther('0.001'),
  //     });
  //
  //     await lp.mint(wallet.address, 10n ** 20n);
  //
  //     // @ts-ignore
  //     await lp.connect(wallet).approve(stakerAddress, 10n ** 20n);
  //
  //     await staker.connect(wallet).stake(10n ** 18n);
  //
  //     console.log('lp balance' + i, await lp.balanceOf(wallet.address));
  //     console.log('lp balance' + i, i % 3);
  //   }
  //
  //   const tx = await staker.distributeRewards(10n ** 10n, 10n ** 10n);
  //   const receipt = await tx.wait()
  //   const gasCostForTxn = receipt?.gasUsed || 0n * (receipt?.gasPrice || 0n)
  //   console.log('gasCostForTxn:', { gasUsed: receipt?.gasUsed, gasPrice: receipt?.gasPrice, gasCostForTxn })
  //
  //   for (let i = 0; i < 0; i++) {
  //     const wallet = new hre.ethers.Wallet(wallets[i].privateKey, hre.ethers.provider);
  //
  //     console.log('staker ' + i, await staker.stakers(wallet.address));
  //   }
  // });
});
