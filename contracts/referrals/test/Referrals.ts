import { referralsFixture } from '../fixtures';
import { expect } from 'chai';


describe('Referrals', () => {
  it('user can should be referred only once', async () => {
    const { referrals, user1, user2 } = await referralsFixture();

    await expect(referrals.connect(user1).register(user2)).not.reverted;

    await expect(referrals.connect(user1).register(user2)).revertedWith('ALREADY_REFERRED');

    expect(await referrals.referrers(user1)).eq(user2);
  });
});
