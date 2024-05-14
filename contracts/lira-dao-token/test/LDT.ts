import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { liraDaoTokenFixture } from '../fixtures';


describe('LiraDaoToken', function () {
  describe('LDT', function () {
    it('Should have 18 decimals', async function () {
      const { ldt } = await loadFixture(liraDaoTokenFixture);

      expect(await ldt.decimals()).to.equal(18);
    });

    it('Should transfer tokens', async function () {
      const { ldt, owner, presale } = await loadFixture(liraDaoTokenFixture);

      // @ts-ignore
      await ldt.connect(presale).transfer(owner, 750_000_000n * 10n ** 18n);

      expect(await ldt.balanceOf(owner)).to.equal(750_000_000n * 10n ** 18n);
      expect(await ldt.balanceOf(presale)).eq(0);
    });
  });
});
