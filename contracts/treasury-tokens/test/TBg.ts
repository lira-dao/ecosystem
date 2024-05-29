import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { treasuryBondGoldFixture } from '../fixtures';
import { expect } from 'chai';

describe('TBg', () => {
  describe('ERC20', () => {
    it('must have 18 decimals', async () => {
      const { tbg } = await loadFixture(treasuryBondGoldFixture);

      expect(await tbg.decimals()).eq(18n);
    });

    it('must have "Treasury Token Gold" as name', async () => {
      const { tbg } = await loadFixture(treasuryBondGoldFixture);

      expect(await tbg.name()).eq('Treasury Bond Gold');
    });

    it('must have "TBg" as symbol', async () => {
      const { tbg } = await loadFixture(treasuryBondGoldFixture);

      expect(await tbg.symbol()).eq('TBg');
    });
  });

  it('must have 100k as ratio', async () => {
    const { tbg } = await loadFixture(treasuryBondGoldFixture);

    expect(await tbg.rate()).eq(100_000n);
  });
});
