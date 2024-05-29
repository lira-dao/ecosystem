import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { treasuryBondSilverFixture } from '../fixtures';
import { expect } from 'chai';

describe('TBs', () => {
  describe('ERC20', () => {
    it('must have 18 decimals', async () => {
      const { tbs } = await loadFixture(treasuryBondSilverFixture);

      expect(await tbs.decimals()).eq(18n);
    });

    it('must have "Treasury Token Silver" as name', async () => {
      const { tbs } = await loadFixture(treasuryBondSilverFixture);

      expect(await tbs.name()).eq('Treasury Bond Silver');
    });

    it('must have "TBs" as symbol', async () => {
      const { tbs } = await loadFixture(treasuryBondSilverFixture);

      expect(await tbs.symbol()).eq('TBs');
    });
  });

  it('must have 10k as ratio', async () => {
    const { tbs } = await loadFixture(treasuryBondSilverFixture);

    expect(await tbs.rate()).eq(10_000n);
  });
});
