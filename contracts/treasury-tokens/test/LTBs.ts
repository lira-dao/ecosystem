import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { liraTreasuryBondSilverFixture } from '../fixtures';


describe('LTBs', () => {
  it('must have 8 decimals', async () => {
    const { ltbs } = await loadFixture(liraTreasuryBondSilverFixture);

    expect(await ltbs.decimals()).eq(8n);
  });

  it('must have "LIRA Treasury Token Silver" as name', async () => {
    const { ltbs } = await loadFixture(liraTreasuryBondSilverFixture);

    expect(await ltbs.name()).eq('LIRA Treasury Bond Silver');
  });

  it('must have "LTBs" as symbol', async () => {
    const { ltbs } = await loadFixture(liraTreasuryBondSilverFixture);

    expect(await ltbs.symbol()).eq('LTBs');
  });

  it('must have 1M as ratio', async () => {
    const { ltbs } = await loadFixture(liraTreasuryBondSilverFixture);

    expect(await ltbs.rate()).eq(1_000_000);
  });
});
