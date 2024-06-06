import { lpStakerFixture } from '../fixtures';
import { expect } from 'chai';
import { appendFileSync } from 'fs';
import hre from 'hardhat';
const fs = require('fs');

describe('LPStaker', () => {
  it('Should deploy mock tokens', async () => {
    const { staker, stakerAddress, lp, token1, token2, owner, user1, user2 } = await lpStakerFixture();

    expect(await lp.name()).to.equal('LP');
    expect(await lp.symbol()).to.equal('LP');

    expect(await token1.name()).to.equal('Token1');
    expect(await token1.symbol()).to.equal('T1');

    expect(await token2.name()).to.equal('Token2');
    expect(await token2.symbol()).to.equal('T2');

    await lp.mint(user1, 10n ** 20n);
    await lp.mint(user2, 10n ** 20n);

    // @ts-ignore
    await lp.connect(user1).approve(stakerAddress, 10n ** 20n);
    // @ts-ignore
    await lp.connect(user2).approve(stakerAddress, 10n ** 20n);

    await token1.mint(owner, 10n ** 20n);
    await token2.mint(owner, 10n ** 20n);

    await token1.approve(stakerAddress, 10n ** 20n);
    await token2.approve(stakerAddress, 10n ** 20n);

    await staker.connect(user1).stake(10n ** 18n);

    console.log('staker1', await staker.stakers(user1));

    // console.log('distribute rewards', 10n ** 18n, 10n ** 18n);
    // await staker.distributeRewards(10n ** 18n, 10n ** 18n);
    //
    // console.log('pending rewards user1', await staker.pendingRewards(user1));
    //
    // await staker.connect(user2).stake(10n ** 18n);

    //console.log('s1 a', await staker.stakers(user1));
    //console.log('s2 a', await staker.stakers(user2));

    // console.log('staker1 a', await staker.pendingRewards(user1));
    // console.log('staker2 a', await staker.pendingRewards(user2));
    // console.log()
    //
    // await staker.connect(user1).harvest();

    //console.log('s1 b', await staker.stakers(user1));
    //console.log('s2 b', await staker.stakers(user2));

    // await staker.distributeRewards(10n ** 18n, 10n ** 18n);
    // console.log('staker1 b', await staker.pendingRewards(user1));
    // console.log('staker2 b', await staker.pendingRewards(user2));
    // console.log()
    //
    // await staker.connect(user2).harvest();
    //
    // const trans = await staker.distributeRewards(10n ** 18n, 10n ** 18n);
    // const receipt = await trans.wait()
    // const gasCostForTxn = receipt?.gasUsed || 0n * (receipt?.gasPrice || 0n)
    // console.log('gasCostForTxn:', { gasUsed: receipt?.gasUsed, gasPrice: receipt?.gasPrice, gasCostForTxn })
    // console.log('staker1 c', await staker.pendingRewards(user1));
    // console.log('staker2 c', await staker.pendingRewards(user2));
  });
});
