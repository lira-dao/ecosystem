import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { liraTreasuryBondBronzeFixture } from '../fixtures';


describe('LTBb', () => {
  describe('ERC20', () => {
    it('must have 8 decimals', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.decimals()).eq(8n);
    });

    it('must have "LIRA Treasury Token Bronze" as name', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.name()).eq('LIRA Treasury Bond Bronze');
    });

    it('must have "LTBb" as symbol', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.symbol()).eq('LTBb');
    });
  });

  it('must have 100k as rate', async () => {
    const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

    expect(await ltbb.rate()).eq(100_000n);
  });
});
