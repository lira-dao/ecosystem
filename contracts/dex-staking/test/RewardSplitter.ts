// import { rewardSplitterFixture } from '../fixtures';
// import { expect } from 'chai';
// import { parseUnits } from 'ethers';
//
// describe('RewardSplitter', () => {
//   it('must have ldt as reward token address', async () => {
//     const { rewardSplitter, ldtAddress } = await rewardSplitterFixture();
//
//     expect((await rewardSplitter.addresses()).ldt).eq(ldtAddress);
//   });
//
//   it('must calculate rewards', async () => {
//     const {
//       deployer,
//       ldt,
//       ldtTeam,
//       rewardSplitter,
//       tbb,
//       tbbFarm,
//       tbbFarmAddress,
//       tbbPair,
//       tbbStaker,
//       tbg,
//       tbgFarm,
//       tbgFarmAddress,
//       tbgPair,
//       tbgStaker,
//       tbs,
//       tbsFarm,
//       tbsFarmAddress,
//       tbsPair,
//       tbsStaker,
//     } = await rewardSplitterFixture();
//
//     // console.log('LDT', await ldt.balanceOf(rewardSplitterAddress));
//
//     // await tbbPair.approve(stakerAddress, 158n * 10n ** 18n);
//     // await staker.stake(158n * 10n ** 18n);
//
//     // console.log('tbb pair', await tbbPair.balanceOf(deployer));
//
//     await tbbPair.approve(tbbFarmAddress, await tbbPair.balanceOf(deployer));
//     await tbbFarm.stake(await tbbPair.balanceOf(deployer));
//
//     await tbsPair.approve(tbsFarmAddress, await tbsPair.balanceOf(deployer));
//     await tbsFarm.stake(await tbsPair.balanceOf(deployer));
//
//     await tbgPair.approve(tbgFarmAddress, await tbgPair.balanceOf(deployer));
//     await tbgFarm.stake(await tbgPair.balanceOf(deployer));
//
//     await rewardSplitter.approveTokens();
//
//     // console.log('tbb pool', formatUnits(await tbb.balanceOf(tbbPairAddress), 18));
//     // console.log('tbb total staked', formatUnits(await tbbFarm.totalStaked(), 18));
//     //
//     // console.log('tb farm before', await tbb.balanceOf(tbbFarmAddress));
//     // console.log('ldt farm before', await ldt.balanceOf(tbbFarmAddress));
//     //
//     // console.log('tb farm before', await tbb.balanceOf(tbsFarmAddress));
//     // console.log('ldt farm before', await ldt.balanceOf(tbsFarmAddress));
//     //
//     // console.log('tb farm before', await tbb.balanceOf(tbgFarmAddress));
//     // console.log('ldt farm before', await ldt.balanceOf(tbgFarmAddress));
//
//     await tbb.mint(deployer, parseUnits('1', 18));
//     await tbbStaker.stake(parseUnits('1', 18));
//
//     await tbs.mint(deployer, parseUnits('1', 18));
//     await tbsStaker.stake(parseUnits('1', 18));
//
//     await tbg.mint(deployer, parseUnits('1', 18));
//     await tbgStaker.stake(parseUnits('1', 18));
//
//
//     // @ts-ignore
//     await ldt.connect(ldtTeam).burn(await ldt.balanceOf(ldtTeam));
//     // await tbb.burn(await tbb.balanceOf(deployer));
//     // await tbs.burn(await tbs.balanceOf(deployer));
//     // await tbg.burn(await tbg.balanceOf(deployer));
//     await ldt.burn(await ldt.balanceOf(deployer));
//
//     console.log('team balances', {
//       ldt: await ldt.balanceOf(ldtTeam),
//       tbb: await tbb.balanceOf(ldtTeam),
//       tbs: await tbs.balanceOf(ldtTeam),
//       tbg: await tbg.balanceOf(ldtTeam),
//     });
//
//     console.log('deployer balances', {
//       ldt: await ldt.balanceOf(deployer),
//       tbb: await tbb.balanceOf(deployer),
//       tbs: await tbs.balanceOf(deployer),
//       tbg: await tbg.balanceOf(deployer),
//     });
//
//     const tx = await rewardSplitter.requestDistribution();
//
//     //await tbbFarm.harvest()
//     //await tbsFarm.harvest()
//     //await tbgFarm.harvest()
//     await tbbStaker.harvest();
//
//     console.log('team balances', {
//       ldt: await ldt.balanceOf(ldtTeam),
//       tbb: await tbb.balanceOf(ldtTeam),
//       tbs: await tbs.balanceOf(ldtTeam),
//       tbg: await tbg.balanceOf(ldtTeam),
//     });
//
//     console.log('deployer balances', {
//       ldt: await ldt.balanceOf(deployer),
//       tbb: await tbb.balanceOf(deployer),
//       tbs: await tbs.balanceOf(deployer),
//       tbg: await tbg.balanceOf(deployer),
//     });
//
//     // console.log('tb farm after', formatUnits(await tbb.balanceOf(tbbFarmAddress), 18));
//     // console.log('ldt farm after', formatUnits(await ldt.balanceOf(tbbFarmAddress), 18));
//     //
//     // console.log('tb farm after', formatUnits(await tbs.balanceOf(tbsFarmAddress), 18));
//     // console.log('ldt farm after', formatUnits(await ldt.balanceOf(tbsFarmAddress), 18));
//     //
//     // console.log('tb farm after', formatUnits(await tbg.balanceOf(tbgFarmAddress), 18));
//     // console.log('ldt farm after', formatUnits(await ldt.balanceOf(tbgFarmAddress), 18));
//   });
//
//   it('owner should recover tbb ownership', async () => {
//     const { rewardSplitter, rewardSplitterAddress, deployer, user, tbb } = await rewardSplitterFixture();
//
//     expect(await tbb.owner()).eq(rewardSplitterAddress);
//
//     await expect(rewardSplitter.connect(user).recoverOwnershipTbb()).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');
//
//     await rewardSplitter.recoverOwnershipTbb();
//
//     expect(await tbb.owner()).eq(deployer);
//   });
//
//   it('owner should recover tbs ownership', async () => {
//     const { rewardSplitter, rewardSplitterAddress, deployer, user, tbs } = await rewardSplitterFixture();
//
//     expect(await tbs.owner()).eq(rewardSplitterAddress);
//
//     await expect(rewardSplitter.connect(user).recoverOwnershipTbs()).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');
//
//     await rewardSplitter.recoverOwnershipTbs();
//
//     expect(await tbs.owner()).eq(deployer);
//   });
//
//   it('owner should recover tbg ownership', async () => {
//     const { rewardSplitter, rewardSplitterAddress, deployer, user, tbg } = await rewardSplitterFixture();
//
//     expect(await tbg.owner()).eq(rewardSplitterAddress);
//
//     await expect(rewardSplitter.connect(user).recoverOwnershipTbg()).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');
//
//     await rewardSplitter.recoverOwnershipTbg();
//
//     expect(await tbg.owner()).eq(deployer);
//   });
//
//   it('owner should recover tbb farm ownership', async () => {
//     const { rewardSplitter, rewardSplitterAddress, deployer, user, tbbFarm } = await rewardSplitterFixture();
//
//     expect(await tbbFarm.owner()).eq(rewardSplitterAddress);
//
//     await expect(rewardSplitter.connect(user).recoverOwnershipTbbFarm()).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');
//
//     await rewardSplitter.recoverOwnershipTbbFarm();
//
//     expect(await tbbFarm.owner()).eq(deployer);
//   });
//
//   it('owner should recover tbs farm ownership', async () => {
//     const { rewardSplitter, rewardSplitterAddress, deployer, user, tbsFarm } = await rewardSplitterFixture();
//
//     expect(await tbsFarm.owner()).eq(rewardSplitterAddress);
//
//     await expect(rewardSplitter.connect(user).recoverOwnershipTbsFarm()).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');
//
//     await rewardSplitter.recoverOwnershipTbsFarm();
//
//     expect(await tbsFarm.owner()).eq(deployer);
//   });
//
//   it('owner should recover tbg farm ownership', async () => {
//     const { rewardSplitter, rewardSplitterAddress, deployer, user, tbgFarm } = await rewardSplitterFixture();
//
//     expect(await tbgFarm.owner()).eq(rewardSplitterAddress);
//
//     await expect(rewardSplitter.connect(user).recoverOwnershipTbgFarm()).revertedWithCustomError(rewardSplitter, 'OwnableUnauthorizedAccount');
//
//     await rewardSplitter.recoverOwnershipTbgFarm();
//
//     expect(await tbgFarm.owner()).eq(deployer);
//   });
//
//   it('owner should set a new tbb reward rate', async () => {
//     const { rewardSplitter } = await rewardSplitterFixture();
//
//     let rate = await rewardSplitter.tbbFarmingRewardRate();
//
//     expect(rate.ldt).eq(200n);
//     expect(rate.tb).eq(200n);
//
//     await expect(rewardSplitter.setTbbFarmingRewardRate(0n, 1n)).revertedWith('INVALID_LDT_RATE');
//     await expect(rewardSplitter.setTbbFarmingRewardRate(100001n, 1n)).revertedWith('INVALID_LDT_RATE');
//
//     await expect(rewardSplitter.setTbbFarmingRewardRate(1n, 0n)).revertedWith('INVALID_TB_RATE');
//     await expect(rewardSplitter.setTbbFarmingRewardRate(1n, 100001n)).revertedWith('INVALID_TB_RATE');
//
//     await rewardSplitter.setTbbFarmingRewardRate(1n, 100000n);
//
//     rate = await rewardSplitter.tbbFarmingRewardRate();
//
//     expect(rate.ldt).eq(1n);
//     expect(rate.tb).eq(100000n);
//   });
//
//   it('owner should set a new tbs reward rate', async () => {
//     const { rewardSplitter } = await rewardSplitterFixture();
//
//     let rate = await rewardSplitter.tbsFarmingRewardRate();
//
//     expect(rate.ldt).eq(500n);
//     expect(rate.tb).eq(500n);
//
//     await expect(rewardSplitter.setTbsFarmingRewardRate(0n, 1n)).revertedWith('INVALID_LDT_RATE');
//     await expect(rewardSplitter.setTbsFarmingRewardRate(100001n, 1n)).revertedWith('INVALID_LDT_RATE');
//
//     await expect(rewardSplitter.setTbsFarmingRewardRate(1n, 0n)).revertedWith('INVALID_TB_RATE');
//     await expect(rewardSplitter.setTbsFarmingRewardRate(1n, 100001n)).revertedWith('INVALID_TB_RATE');
//
//     await rewardSplitter.setTbsFarmingRewardRate(1n, 100000n);
//
//     rate = await rewardSplitter.tbsFarmingRewardRate();
//
//     expect(rate.ldt).eq(1n);
//     expect(rate.tb).eq(100000n);
//   });
//
//   it('owner should set a new tbg reward rate', async () => {
//     const { rewardSplitter } = await rewardSplitterFixture();
//
//     let rate = await rewardSplitter.tbgFarmingRewardRate()
//
//     expect(rate.ldt).eq(1000n);
//     expect(rate.tb).eq(1000n);
//
//     await expect(rewardSplitter.setTbgFarmingRewardRate(0n, 1n)).revertedWith('INVALID_LDT_RATE');
//     await expect(rewardSplitter.setTbgFarmingRewardRate(100001n, 1n)).revertedWith('INVALID_LDT_RATE');
//
//     await expect(rewardSplitter.setTbgFarmingRewardRate(1n, 0n)).revertedWith('INVALID_TB_RATE');
//     await expect(rewardSplitter.setTbgFarmingRewardRate(1n, 100001n)).revertedWith('INVALID_TB_RATE');
//
//     await rewardSplitter.setTbgFarmingRewardRate(1n, 100000n);
//
//     rate = await rewardSplitter.tbgFarmingRewardRate();
//
//     expect(rate.ldt).eq(1n);
//     expect(rate.tb).eq(100000n);
//   });
// });
