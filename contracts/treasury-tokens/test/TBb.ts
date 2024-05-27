import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { liraTreasuryBondBronzeFixture } from '../fixtures';
import { expect } from 'chai';

describe('TBb', () => {
  describe('ERC20', () => {
    it('must have 18 decimals', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.decimals()).eq(18n);
    });

    it('must have "Treasury Token Bronze" as name', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.name()).eq('Treasury Bond Bronze');
    });

    it('must have "TBb" as symbol', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.symbol()).eq('TBb');
    });
  });

  it('must have 1k as ratio');
});
