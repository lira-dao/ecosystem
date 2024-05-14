import { mockWethFixture } from '../fixtures';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import hre from 'hardhat';

describe('MockWETH', () => {
  it('must have "Wrapped Ether" as name', async () => {
    const { weth } = await loadFixture(mockWethFixture);

    expect(await weth.name()).eq('Wrapped Ether');
  });

  it('must have "WETH" as symbol', async () => {
    const { weth } = await loadFixture(mockWethFixture);

    expect(await weth.symbol()).eq('WETH');
  });

  it('must have 18 decimals', async () => {
    const { weth } = await loadFixture(mockWethFixture);

    expect(await weth.decimals()).eq(18);
  });

  it('expect wrap and un unwrap ether', async () => {
    const { weth, owner } = await loadFixture(mockWethFixture);

    await weth.deposit({ value: 10n ** 18n });

    expect(await weth.balanceOf(owner)).eq(10n ** 18n);

    await weth.withdraw(10n ** 18n);

    expect(await weth.balanceOf(owner)).eq(0);
  });

  it('owner can mint weth', async () => {
    const { weth, owner } = await loadFixture(mockWethFixture);

    expect(await weth.balanceOf(owner)).eq(0);

    await weth.mint(10n ** 18n);

    expect(await weth.balanceOf(owner)).eq(10n ** 18n);
  });

  it('owner can burn weth', async () => {
    const { weth, owner } = await loadFixture(mockWethFixture);

    await weth.mint(10n ** 18n);
    await weth.burn(10n ** 18n);

    expect(await weth.balanceOf(owner)).eq(0);
  });
});
