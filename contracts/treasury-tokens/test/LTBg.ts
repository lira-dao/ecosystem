import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { liraTreasuryBondGoldFixture } from '../fixtures';


describe('LTBs', () => {
  it('must have 8 decimals', async () => {
    const { ltbg } = await loadFixture(liraTreasuryBondGoldFixture);

    expect(await ltbg.decimals()).eq(8n);
  });

  it('must have "LIRA Treasury Token Gold" as name', async () => {
    const { ltbg } = await loadFixture(liraTreasuryBondGoldFixture);

    expect(await ltbg.name()).eq('LIRA Treasury Bond Gold');
  });

  it('must have "LTBs" as symbol', async () => {
    const { ltbg } = await loadFixture(liraTreasuryBondGoldFixture);

    expect(await ltbg.symbol()).eq('LTBg');
  });
});
