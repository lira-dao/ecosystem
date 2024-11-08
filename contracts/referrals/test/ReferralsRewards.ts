import { referralsRewardsFixture } from '../fixtures';
import { expect } from 'chai';
import { parseUnits } from 'ethers';

describe('ReferralsRewards', () => {

  it('should have ldt address', async () => {
    const { referrals, ldtAddress } = await referralsRewardsFixture();

    expect(await referrals.ldt()).equal(ldtAddress);
  });

  it('should have tbb address', async () => {
    const { referrals, tbbAddress } = await referralsRewardsFixture();

    expect(await referrals.tbb()).equal(tbbAddress);
  });

  it('should have tbs address', async () => {
    const { referrals, tbsAddress } = await referralsRewardsFixture();

    expect(await referrals.tbs()).equal(tbsAddress);
  });

  it('should have tbg address', async () => {
    const { referrals, tbgAddress } = await referralsRewardsFixture();

    expect(await referrals.tbg()).equal(tbgAddress);
  });

  it('owner should distribute rewards and user should harvest rewards', async () => {
    const {
      referrals,
      referralsAddress,
      ldt,
      tbb,
      tbbAddress,
      tbs,
      tbsAddress,
      tbg,
      tbgAddress,
      deployer,
      user1,
    } = await referralsRewardsFixture();

    await ldt.approve(tbbAddress, await ldt.balanceOf(deployer));
    await tbb.mint(deployer, parseUnits('1'));

    await ldt.approve(tbsAddress, await ldt.balanceOf(deployer));
    await tbs.mint(deployer, parseUnits('0.1'));

    await ldt.approve(tbgAddress, await ldt.balanceOf(deployer));
    await tbg.mint(deployer, parseUnits('0.01'));

    await ldt.transfer(referralsAddress, parseUnits('100'));
    await tbb.transfer(referralsAddress, parseUnits('1'));
    await tbs.transfer(referralsAddress, parseUnits('0.1'));
    await tbg.transfer(referralsAddress, parseUnits('0.01'));

    await referrals.distributeRewards([{
      wallet: user1,
      ldt: parseUnits('100'),
      tbb: parseUnits('1'),
      tbs: parseUnits('0.1'),
      tbg: parseUnits('0.01'),
    }]);

    const rewards = await referrals.rewards(user1);

    expect(rewards.ldt).eq(parseUnits('100'));
    expect(rewards.tbb).eq(parseUnits('1'));
    expect(rewards.tbs).eq(parseUnits('0.1'));
    expect(rewards.tbg).eq(parseUnits('0.01'));

    expect(await ldt.balanceOf(user1)).eq(0);
    expect(await tbb.balanceOf(user1)).eq(0);
    expect(await tbs.balanceOf(user1)).eq(0);
    expect(await tbg.balanceOf(user1)).eq(0);

    await expect(referrals.harvest()).revertedWith('ZERO_REWARDS');
    await expect(referrals.connect(user1).harvest()).not.reverted;

    expect(await ldt.balanceOf(user1)).eq(parseUnits('100'));
    expect(await tbb.balanceOf(user1)).eq(parseUnits('1'));
    expect(await tbs.balanceOf(user1)).eq(parseUnits('0.1'));
    expect(await tbg.balanceOf(user1)).eq(parseUnits('0.01'));

    await tbb.mint(deployer, parseUnits('1'));
    await tbs.mint(deployer, parseUnits('0.1'));
    await tbg.mint(deployer, parseUnits('0.01'));

    await tbb.approve(referralsAddress, await tbb.balanceOf(deployer));
    await tbs.approve(referralsAddress, await tbs.balanceOf(deployer));
    await tbg.approve(referralsAddress, await tbg.balanceOf(deployer));

    await referrals.distributeRewards([{
      wallet: user1,
      ldt: parseUnits('100'),
      tbb: parseUnits('1'),
      tbs: parseUnits('0.1'),
      tbg: parseUnits('0.01'),
    }]);

    await expect(referrals.connect(user1).harvest()).revertedWith('TIME_LOCK');
  });
});