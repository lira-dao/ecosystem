import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import hre from 'hardhat';
import LDTArtifact from '@satoshi-lira/lira-dao-token/artifacts/contracts/LTD.sol/LDT.json';
import { LDT } from '@satoshi-lira/lira-dao-token/typechain-types';
import { increaseTo } from '@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time';


describe('LiraDaoPresale', function () {
  async function liraDaoPresaleFixture() {
    const [owner] = await hre.ethers.getSigners();

    const ldtFactory = new hre.ethers.ContractFactory<[string, string, string, string, string], LDT>(LDTArtifact.abi, LDTArtifact.bytecode, owner);
    const ldt = await ldtFactory.deploy(owner.address, owner.address, owner.address, owner.address, owner.address);

    const LiraDaoPresale = await hre.ethers.getContractFactory('LiraDaoPresale');
    const presale = await LiraDaoPresale.deploy(ldt);

    const presaleStarted = await LiraDaoPresale.deploy(ldt);

    await ldt.transfer(presaleStarted, 750_000_000n * 10n ** 18n);
    await ldt.burn(await ldt.balanceOf(owner));

    const start = await presaleStarted.start([15, 10, 5, 0], 1200);

    const block = await start.getBlock();
    const time = block?.timestamp ?? 0;

    return { ldt, presale, presaleStarted, time, owner };
  }

  it('must have deployer as contract owner', async () => {
    const { presale, owner } = await loadFixture(liraDaoPresaleFixture);
    expect(await presale.owner()).eq(owner);
  });

  it('must have a token address', async () => {
    const { presale, ldt } = await loadFixture(liraDaoPresaleFixture);
    expect(await presale.token()).eq(await ldt.getAddress());
  });

  it('started must be false', async () => {
    const { presale } = await loadFixture(liraDaoPresaleFixture);
    expect(await presale.started()).eq(false);
  });

  it('must have an amount on tokens', async () => {
    const { ldt, presaleStarted } = await loadFixture(liraDaoPresaleFixture);

    expect(await ldt.balanceOf(presaleStarted)).eq(750_000_000n * 10n ** 18n);
  });

  it('start the presale', async () => {
    const { presaleStarted, time } = await loadFixture(liraDaoPresaleFixture);

    expect(await presaleStarted.started()).eq(true);

    const round = await presaleStarted.round();

    expect(round.start).eq(time);
    expect(round.end).eq(time + 1199);
    expect(round.bonus).eq(15);
    expect(round.number).eq(1);
  });

  it('round 1 must have 15% bonus', async () => {
    const { presaleStarted, time } = await loadFixture(liraDaoPresaleFixture);

    expect((await presaleStarted.round()).bonus).eq(15n);

    await increaseTo(time + 1199);

    expect((await presaleStarted.round()).number).eq(1);
    expect((await presaleStarted.round()).bonus).eq(15n);

    await increaseTo(time + 1200);

    expect((await presaleStarted.round()).number).eq(2);
    expect((await presaleStarted.round()).bonus).not.eq(15n);
  });

  it('round 2 must have 10% bonus', async () => {
    const { presaleStarted, time } = await loadFixture(liraDaoPresaleFixture);

    await increaseTo(time + 1200);

    expect((await presaleStarted.round()).number).eq(2);
    expect((await presaleStarted.round()).bonus).eq(10);

    await increaseTo(time + 2399);

    expect((await presaleStarted.round()).number).eq(2);
    expect((await presaleStarted.round()).bonus).eq(10);

    await increaseTo(time + 2400);

    expect((await presaleStarted.round()).number).eq(3);
    expect((await presaleStarted.round()).bonus).not.eq(10);
  });

  it('round 3 must have 5% bonus', async () => {
    const { presaleStarted, time } = await loadFixture(liraDaoPresaleFixture);

    await increaseTo(time + 2400);

    expect((await presaleStarted.round()).number).eq(3);
    expect((await presaleStarted.round()).bonus).eq(5);

    await increaseTo(time + 3599);

    expect((await presaleStarted.round()).number).eq(3);
    expect((await presaleStarted.round()).bonus).eq(5);

    await increaseTo(time + 3600);

    expect((await presaleStarted.round()).number).eq(4);
    expect((await presaleStarted.round()).bonus).not.eq(5);
  });

  it('round 4 must have 0% bonus', async () => {
    const { presaleStarted, time } = await loadFixture(liraDaoPresaleFixture);

    await increaseTo(time + 3600);

    expect((await presaleStarted.round()).number).eq(4);
    expect((await presaleStarted.round()).bonus).eq(0);

    await increaseTo(time + 4799);

    expect((await presaleStarted.round()).number).eq(4);
    expect((await presaleStarted.round()).bonus).eq(0);

    await increaseTo(time + 4800);

    expect(await presaleStarted.started()).eq(false);
  });

  it('users should buy ldt for eth', async () => {
    const { presaleStarted, time, ldt, owner } = await loadFixture(liraDaoPresaleFixture);

    await presaleStarted.buy({ value: 10n ** 12n });

    const amount = (10n ** 12n / 4n) * (10n ** 6n);
    let bonus = (amount / 100n) * 15n;

    expect(await ldt.balanceOf(owner)).eq(amount + bonus);

    await increaseTo(time + 1200);

    await ldt.burn(await ldt.balanceOf(owner));
    await presaleStarted.buy({ value: 10n ** 12n });

    bonus = (amount / 100n) * 10n;
    expect(await ldt.balanceOf(owner)).eq(amount + bonus);

    await increaseTo(time + 2400);

    await ldt.burn(await ldt.balanceOf(owner));
    await presaleStarted.buy({ value: 10n ** 12n });

    bonus = (amount / 100n) * 5n;
    expect(await ldt.balanceOf(owner)).eq(amount + bonus);

    await increaseTo(time + 3600);

    await ldt.burn(await ldt.balanceOf(owner));
    await presaleStarted.buy({ value: 10n ** 12n });

    expect(await ldt.balanceOf(owner)).eq(amount);
  });

  it('must not revert with LDT_PRESALE_INSUFFICIENT_SUPPLY', async () => {
    const { presaleStarted, time, ldt, owner } = await loadFixture(liraDaoPresaleFixture);

    await expect(presaleStarted.buy({ value: 2608n * (10n ** 18n) })).to.not.be.revertedWith('LDT_PRESALE_INSUFFICIENT_SUPPLY');
  });

  it('must revert with LDT_PRESALE_INSUFFICIENT_SUPPLY', async () => {
    const { presaleStarted, time, ldt, owner } = await loadFixture(liraDaoPresaleFixture);

    await expect(presaleStarted.buy({ value: 2609n * (10n ** 18n) })).to.be.revertedWith('LDT_PRESALE_INSUFFICIENT_SUPPLY');
  });

  it('must withdraw token when the presale is over', async () => {
    const { presaleStarted, ldt, time, owner } = await loadFixture(liraDaoPresaleFixture);

    await ldt.burn(await ldt.balanceOf(owner));

    await increaseTo(time + 4800);
    await presaleStarted.withdrawToken();

    expect(await ldt.balanceOf(owner)).eq(750_000_000n * 10n ** 18n);

    await ldt.burn(750_000_000n * 10n ** 18n);

    expect(await ldt.balanceOf(owner)).eq(0);
  });
});
