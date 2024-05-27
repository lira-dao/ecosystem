import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { treasuryBondBronzeFixture } from '../fixtures';
import { expect } from 'chai';

describe('TBb', () => {
  describe('ERC20', () => {
    it('must have 18 decimals', async () => {
      const { tbb } = await loadFixture(treasuryBondBronzeFixture);

      expect(await tbb.decimals()).eq(18n);
    });

    it('must have "Treasury Token Bronze" as name', async () => {
      const { tbb } = await loadFixture(treasuryBondBronzeFixture);

      expect(await tbb.name()).eq('Treasury Bond Bronze');
    });

    it('must have "TBb" as symbol', async () => {
      const { tbb } = await loadFixture(treasuryBondBronzeFixture);

      expect(await tbb.symbol()).eq('TBb');
    });
  });

  it('must have 1k as ratio');
});
