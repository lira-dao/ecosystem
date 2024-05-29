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

    it('owner can mint when mint is disabled', async () => {
      const {
        ltbb,
        ltbbAddress,
        lira,
        liraAddress,
        wbtc,
        owner,
      } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.isMintEnabled()).eq(false);

      await wbtc.mint(liraAddress, 10n ** 10n);

      await lira.mint(owner, 10n ** 16n, 10n ** 10n);

      const ltbbQuoteMint = (await ltbb.quoteMint(10n ** 8n))[0];

      // @ts-ignore
      await lira.burn(owner, await lira.balanceOf(owner) - ltbbQuoteMint);

      // @ts-ignore
      await lira.approve(ltbbAddress, ltbbQuoteMint);

      // @ts-ignore
      await ltbb.mint(owner, 10n ** 8n);

      expect(await lira.balanceOf(owner)).eq(0n);
      expect(await ltbb.balanceOf(owner)).eq(10n ** 8n);
      expect(await ltbb.feeAmount()).eq(0);
    });

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
    it('must have owner as fee vault', async () => {
      const { ltbb, owner } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.feeVault()).eq(owner);
    });

    it('must set a new fee vault address', async () => {
      const { ltbb, minter } = await loadFixture(liraTreasuryBondBronzeFixture);

      await ltbb.setFeeVault(minter);

      expect(await ltbb.feeVault()).eq(minter);
    });

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

      for (let i = 1n; i <= 30n; i++) {
        await ltbb.setMintFee(i);
        expect(await ltbb.mintFee()).eq(i);
      }
    });

    it('setMintFee must revert for mint fee < 1', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      await expect(ltbb.setMintFee(0n)).revertedWith('INVALID_MINT_FEE');
    });

    it('setMintFee must revert for mint fee > 30', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      await expect(ltbb.setMintFee(31n)).revertedWith('INVALID_MINT_FEE');
    });
  });

  describe('Burn Fee', () => {
    it('must have 10 burn fee', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.burnFee()).eq(10n);
    });

    it('owner can set burn fee to a value between 1 and 30', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      for (let i = 1n; i <= 30n; i++) {
        await ltbb.setBurnFee(i);
        expect(await ltbb.burnFee()).eq(i);
      }
    });

    it('setMintFee must revert for burn fee < 1', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      await expect(ltbb.setBurnFee(0n)).revertedWith('INVALID_BURN_FEE');
    });

    it('setMintFee must revert for burn fee > 30', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      await expect(ltbb.setBurnFee(31n)).revertedWith('INVALID_BURN_FEE');
    });
  });

  describe('Mint Fee DAO', () => {
    it('must have 0 mint fee dao', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.mintFeeDao()).eq(0n);
    });

    it('owner can set mint fee dao to a value between 0 and 30', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      for (let i = 0n; i <= 30n; i++) {
        await ltbb.setMintFeeDao(i);
        expect(await ltbb.mintFeeDao()).eq(i);
      }
    });

    it('setMintFeeDao must revert for mint fee > 30', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      await expect(ltbb.setMintFeeDao(31n)).revertedWith('INVALID_MINT_FEE');
    });
  });

  describe('Burn Fee DAO', () => {
    it('must have 0 burn fee dao', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      expect(await ltbb.burnFeeDao()).eq(0n);
    });

    it('owner can set burn fee dao to a value between 0 and 30', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      for (let i = 0n; i <= 30n; i++) {
        await ltbb.setBurnFeeDao(i);
        expect(await ltbb.burnFeeDao()).eq(i);
      }
    });

    it('setMintFeeDao must revert for burn fee > 30', async () => {
      const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

      await expect(ltbb.setBurnFeeDao(31n)).revertedWith('INVALID_BURN_FEE');
    });
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

      // @ts-ignore
      await lira.connect(minter).burn(owner, await lira.balanceOf(minter) - ltbbQuoteMint);

      // @ts-ignore
      await lira.connect(minter).approve(ltbbAddress, ltbbQuoteMint);

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
