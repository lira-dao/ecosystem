import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { liraTreasuryBondBronzeFixture } from '../fixtures';
import { expect } from 'chai';

describe('TBs', () => {
  describe('ERC20', () => {
    it('must have 18 decimals', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.decimals()).eq(18n);
    });

    it('must have "Treasury Token Silver" as name', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.name()).eq('Treasury Bond Silver');
    });

    it('must have "TBs" as symbol', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.symbol()).eq('TBs');
    });
  });

  it('must have 10k as ratio');
});
