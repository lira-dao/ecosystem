import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { liraTreasuryBondBronzeFixture } from '../fixtures';
import { expect } from 'chai';

describe('TBg', () => {
  describe('ERC20', () => {
    it('must have 18 decimals', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.decimals()).eq(18n);
    });

    it('must have "Treasury Token Gold" as name', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.name()).eq('Treasury Bond Gold');
    });

    it('must have "TBg" as symbol', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.symbol()).eq('TBg');
    });
  });

  it('must have 100k as ratio');
});
