import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { liraTreasuryBondBronzeFixture } from '../fixtures';


describe('TreasuryToken', () => {
  describe('Mint Enabled', () => {
    it('must have isMintEnabled set to false', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.isMintEnabled()).eq(false);
    });

    it('must set isMintEnabled to true', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      await ltbb.setIsMintEnabled(true);

      expect(await ltbb.isMintEnabled()).eq(true);
    });

    it('owner can mint when mint is disabled');

    it('must revert with "MINT_DISABLED" if isMingEnable is false', async () => {
      const {
        ltbb,
        ltbbAddress,
        lira,
        liraAddress,
        wbtc,
        owner,
        minter,
      } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.isMintEnabled()).eq(false);

      await wbtc.mint(liraAddress, 10n ** 10n);

      await lira.mint(minter, 10n ** 16n, 10n ** 10n);

      const ltbbQuoteMint = (await ltbb.quoteMint(10n ** 8n))[0];

      // @ts-ignore
      await lira.connect(minter).burn(minter, await lira.balanceOf(minter) - ltbbQuoteMint);

      // @ts-ignore
      await lira.connect(minter).approve(ltbbAddress, ltbbQuoteMint);

      // @ts-ignore
      await expect(ltbb.connect(minter).mint(owner, 10n ** 8n)).revertedWith('MINT_DISABLED');
    });
  });

  describe('Fee Vault', () => {
    it('must have owner as fee vault');

    it('must set a new fee vault address');

    it('owner can withdraw fees to his address with collectFees');

    it('owner can withdraw fees to another address with collectFeesTo');

    it('must revert if user tries to withdraw fees');
  });

  describe('Mint Fee', () => {
    it('must have 10 mint fee', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.mintFee()).eq(10n);
    });

    it('owner can set mint fee to a value between 1 and 30', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      await ltbb.setMintFee(30n);

      expect(await ltbb.mintFee()).eq(30n);
    });

    it('setMintFee must revert for mint fee < 1', async () => {
    });

    it('setMintFee must revert for mint fee > 30', async () => {
    });
  });

  describe('Burn Fee', () => {
  });

  describe('Mint And Burn', () => {
    it('must mint and burn 1 treasury token', async () => {
      const {
        ltbb,
        ltbbAddress,
        lira,
        liraAddress,
        wbtc,
        owner,
        minter,
      } = await loadFixture(liraTreasuryBondBronzeFixture);

      await wbtc.mint(liraAddress, 10n ** 10n);

      await lira.mint(minter, 10n ** 16n, 10n ** 10n);

      await ltbb.setIsMintEnabled(true);

      // @ts-ignore
      const ltbbQuoteMint = (await ltbb.connect(minter).quoteMint(10n ** 8n))[0];

      console.log('ltbbQuoteMint', await ltbb.quoteMint(10n ** 8n));

      // @ts-ignore
      await lira.connect(minter).burn(owner, await lira.balanceOf(minter) - ltbbQuoteMint);

      // @ts-ignore
      await lira.connect(minter).approve(ltbbAddress, ltbbQuoteMint);

      console.log('aaa', await lira.allowance(minter, ltbbAddress) === ltbbQuoteMint);

      // @ts-ignore
      await ltbb.connect(minter).mint(minter, 10n ** 8n);

      expect(await ltbb.balanceOf(minter)).eq(10n ** 8n);
      expect(await lira.balanceOf(minter)).eq(0n);
      expect(await lira.balanceOf(ltbbAddress)).eq(ltbbQuoteMint);
      expect(await ltbb.feeAmount()).eq(10n ** 12n);

      await ltbb.collectFees();

      expect(await lira.balanceOf(owner)).eq(10n ** 12n);

      await lira.burn(owner, await lira.balanceOf(owner));
      expect(await lira.balanceOf(owner)).eq(0n);

      // @ts-ignore
      await ltbb.connect(minter).burn(await ltbb.balanceOf(minter));
      expect(await lira.balanceOf(minter)).eq(9n * (10n ** 12n));
      expect(await ltbb.feeAmount()).eq(10n ** 12n);
    });

    it('owner can mint and burn below one token', async () => {
      const { ltbb, ltbbAddress, lira, liraAddress, wbtc, owner } = await loadFixture(liraTreasuryBondBronzeFixture);

      await wbtc.mint(liraAddress, 10n ** 10n);

      await lira.mint(owner, 10n ** 16n, 10n ** 10n);

      const ltbbQuoteMint = (await ltbb.quoteMint(10n ** 6n))[0];
      await lira.burn(owner, await lira.balanceOf(owner) - ltbbQuoteMint);
      await lira.approve(ltbbAddress, ltbbQuoteMint);
      await ltbb.mint(owner, 10n ** 6n);

      expect(await ltbb.balanceOf(owner)).eq(10n ** 6n);
      expect(await lira.balanceOf(owner)).eq(0n);
      expect(await lira.balanceOf(ltbbAddress)).eq(ltbbQuoteMint);
      expect(await ltbb.feeAmount()).eq(0n);
    });
  });
});
