import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { baseFaucetFixture } from '../fixtures';
import { increase } from '@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time';


describe('BaseFaucet', function () {
  it('must have ldt address as token address', async function () {
    const { baseFaucet, ldtAddress } = await loadFixture(baseFaucetFixture);

    expect(await baseFaucet.token()).eq(ldtAddress);
  });

  it('must revert with "INSUFFICIENT_FOUNDS"', async () => {
    const { baseFaucet } = await loadFixture(baseFaucetFixture);

    await expect(baseFaucet.withdraw()).revertedWith('INSUFFICIENT_FUNDS');
  });

  it('user can withdraw 10n ** 18n tokens', async () => {
    const { baseFaucet, baseFaucetAddress, ldt, user, vault } = await loadFixture(baseFaucetFixture);

    // @ts-ignore
    await ldt.connect(vault).transfer(baseFaucetAddress, 10n ** 18n);

    expect(await ldt.balanceOf(baseFaucet)).eq(10n ** 18n);

    // @ts-ignore
    await expect(baseFaucet.connect(user).withdraw()).emit(baseFaucet, 'Withdraw').withArgs(user, 10n ** 18n);

    expect(await ldt.balanceOf(user)).eq(10n ** 18n);
    expect(await ldt.balanceOf(baseFaucet)).eq(0);
  });

  it('users can withdraw once a day', async () => {
    const { baseFaucet, baseFaucetAddress, ldt, user, vault } = await loadFixture(baseFaucetFixture);

    // @ts-ignore
    await ldt.connect(vault).transfer(baseFaucetAddress, 2n * 10n ** 18n);

    expect(await ldt.balanceOf(baseFaucet)).eq(2n * 10n ** 18n);

    // @ts-ignore
    await baseFaucet.connect(user).withdraw();

    await expect(baseFaucet.connect(user).withdraw()).revertedWith('NOT_ALLOWED');

    await increase(86400); // 1 day

    // @ts-ignore
    await baseFaucet.connect(user).withdraw();

    expect(await ldt.balanceOf(user)).eq(2n * 10n ** 18n);
    expect(await ldt.balanceOf(baseFaucet)).eq(0);
  });

  it('owner must be able to set token amount', async () => {
    const { baseFaucet } = await loadFixture(baseFaucetFixture);

    expect(await baseFaucet.tokenAmount()).eq(10n ** 18n);

    await baseFaucet.setTokenAmount(42n);

    expect(await baseFaucet.tokenAmount()).eq(42n);
  });

  it('owner must be able to set wait time', async () => {
    const { baseFaucet } = await loadFixture(baseFaucetFixture);

    expect(await baseFaucet.waitTime()).eq(86400);

    await baseFaucet.setWaitTime(42n);

    expect(await baseFaucet.waitTime()).eq(42n);
  });

  it('owner must be able to withdraw all tokens', async () => {
    const { baseFaucet, baseFaucetAddress, ldt, owner, user, vault } = await loadFixture(baseFaucetFixture);

    // @ts-ignore
    await ldt.connect(vault).transfer(baseFaucetAddress, 10n ** 18n);

    expect(await ldt.balanceOf(baseFaucetAddress)).eq(10n ** 18n);
    expect(await ldt.balanceOf(owner)).eq(0);

    await expect(baseFaucet.connect(user).empty()).revertedWithCustomError(baseFaucet, 'OwnableUnauthorizedAccount');

    await baseFaucet.empty();

    expect(await ldt.balanceOf(owner)).eq(10n ** 18n);
    expect(await ldt.balanceOf(baseFaucetAddress)).eq(0);
  });
});
