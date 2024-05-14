import { expect } from 'chai';
import { liraFixture } from '../fixtures';
import { ethers, parseUnits } from 'ethers';


describe('LIRA', () => {

  describe('IERC20Metadata', () => {
    it('name', async () => {
      const { lira } = await liraFixture();

      expect(await lira.name()).eq('Satoshi LIRA');
    });

    it('symbol', async () => {
      const { lira } = await liraFixture();

      expect(await lira.symbol()).eq('LIRA');
    });

    it('decimals', async () => {
      const { lira } = await liraFixture();

      expect(await lira.decimals()).eq(8);
    });
  });

  describe('LIRA token', () => {
    it('should have a wbtc address', async () => {
      const { lira, wbtc } = await liraFixture();

      expect(await lira.wbtc()).eq(await wbtc.getAddress());
    });

    it('can transfer ownership to deployer to minter', async () => {
      const { lira, owner, minter } = await liraFixture();

      expect(await lira.owner()).eq(owner);

      await lira.transferOwnership(minter);

      expect(await lira.owner()).eq(minter);
    });

    it('can be minted by the owner', async () => {
      const { lira, liraAddress, wbtc, minter } = await liraFixture();

      await wbtc.mint(liraAddress, 10000);

      const quote = await lira.quoteMint(1, 5);

      await lira.mint(minter, quote[0], quote[1]);

      expect(await wbtc.balanceOf(liraAddress)).eq(10000);
      expect(await lira.lockedSupply()).eq(10000);
      expect(await lira.balanceOf(minter)).eq(parseUnits('10000', 8));
    });

    it('throw error if burned less than 10k LIRA', async () => {
      const { lira, minter } = await liraFixture();

      await expect(lira.burn(minter, '999999999999')).revertedWith('LIRA_INSUFFICIENT_AMOUNT');
    });

    it('should mint a supply over 21M', async () => {
      const { lira, liraAddress, wbtc, owner } = await liraFixture();

      await wbtc.mint(liraAddress, parseUnits('1', 8));
      const quote = await lira.quoteMint(5000, 5);
      await lira.mint(owner, quote[0], quote[1]);

      expect(await lira.totalSupply()).gte(parseUnits('21', 6 + 8));
      expect(await lira.totalSupply()).lte(parseUnits('50', 6 + 8));
    });

    it('should burn lira receiving back wbtc', async () => {
      const { lira, wbtc, owner } = await liraFixture();

      expect(await lira.balanceOf(owner)).eq(parseUnits('10000', 8));

      const quoteBurn = await lira.quoteBurn(parseUnits('10000', 8));

      await lira.burn(owner, parseUnits('10000', 8));

      expect(quoteBurn).eq(await wbtc.balanceOf(owner));
    });

    it('can transfer ownership to address zero', async () => {
      const { lira, liraAddress, wbtc, owner } = await liraFixture();

      expect(await lira.owner()).eq(owner);

      await wbtc.mint(liraAddress, 20000);

      let quote = await lira.quoteMint(2, 5);

      await lira.mint(owner, quote[0], quote[1]);

      await lira.renounceOwnership();

      expect(await lira.owner()).eq(ethers.ZeroAddress);

      await wbtc.mint(liraAddress, parseUnits('1', 4));

      await expect(lira.mint(owner, 1, 5)).revertedWith('Ownable: caller is not the owner');

      await lira.burn(owner, parseUnits('10000', 8));
    });
  });
});
