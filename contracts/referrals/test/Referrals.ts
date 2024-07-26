import { referralsFixture } from '../fixtures';
import { expect } from 'chai';


describe('Referrals', () => {
  it('user can should be referred only once', async () => {
    const { referrals, user1, user2 } = await referralsFixture();

    await expect(referrals.connect(user1).register(user2)).not.reverted;

    await expect(referrals.connect(user1).register(user2)).revertedWith('ALREADY_REFERRED');

    expect(await referrals.referrers(user1)).eq(user2);
  });

  it('referred function should return false if not referred', async () => {
    const { referrals, user1 } = await referralsFixture();

    expect(await referrals.referred(user1)).eq(false);
  });

  it('referred function should return true if referred', async () => {
    const { referrals, user1, user2 } = await referralsFixture();

    await expect(referrals.connect(user1).register(user2)).not.reverted;

    expect(await referrals.referred(user1)).eq(true);
  });
});
