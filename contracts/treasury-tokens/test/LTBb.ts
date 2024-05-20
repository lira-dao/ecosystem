import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { liraTreasuryBondBronzeFixture } from '../fixtures';


describe('LTBb', () => {
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

  it('must have isMintEnabled set to false', async () => {
    const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

    expect(await ltbb.isMintEnabled()).eq(false);
  });

  it('must set isMintEnabled to true', async () => {
    const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

    await ltbb.setIsMintEnabled(true);

    expect(await ltbb.isMintEnabled()).eq(true);
  });

  it('must have owner as fee vault');

  it('must set a new fee vault address');

  it('must have 10 mint fee', async () => {
    const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

    expect(await ltbb.mintFee()).eq(10n);
  });

  it('must set mint fee to 20', async () => {
    const { ltbb } = await loadFixture(liraTreasuryBondBronzeFixture);

    await ltbb.setMintFee(20n);

    expect(await ltbb.mintFee()).eq(20n);
  });

  it('must revert with "" if isMingEnable is false', async () => {
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

  it('must mint and burn 1 treasury token', async () => {
    const { ltbb, ltbbAddress, lira, liraAddress, wbtc, owner, minter } = await loadFixture(liraTreasuryBondBronzeFixture);

    await wbtc.mint(liraAddress, 10n ** 10n);

    await lira.mint(minter, 10n ** 16n, 10n ** 10n);

    await ltbb.setIsMintEnabled(true);

    const ltbbQuoteMint = (await ltbb.quoteMint(10n ** 8n))[0];

    console.log('ltbbQuoteMint', ltbbQuoteMint);

    // @ts-ignore
    await lira.connect(minter).burn(owner, await lira.balanceOf(minter) - ltbbQuoteMint);

    // @ts-ignore
    await lira.connect(minter).approve(ltbbAddress, ltbbQuoteMint);

    console.log('aaa', await lira.allowance(minter, ltbbAddress) ===ltbbQuoteMint );

    // @ts-ignore
    await ltbb.connect(minter).mint(minter, 10n ** 8n);

    // expect(await ltbb.balanceOf(minter)).eq(10n ** 8n);
    // expect(await lira.balanceOf(minter)).eq(0n);
    // expect(await lira.balanceOf(ltbbAddress)).eq(ltbbQuoteMint);
    // expect(await ltbb.feeAmount()).eq(10n ** 12n);
    //
    // await ltbb.collectFees();
    //
    // expect(await lira.balanceOf(owner)).eq(10n ** 12n);
    //
    // await lira.burn(owner, await lira.balanceOf(owner));
    // expect(await lira.balanceOf(owner)).eq(0n);
    //
    // await ltbb.burn(await ltbb.balanceOf(owner));
    // expect(await lira.balanceOf(owner)).eq(9n * (10n ** 12n));
    // expect(await ltbb.feeAmount()).eq(10n ** 12n);
  });

  it('owner can mint below one token', async () => {
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
