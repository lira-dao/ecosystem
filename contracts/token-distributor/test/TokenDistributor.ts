import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { tokenDistributorFixture } from '../fixtures';
import { expect } from 'chai';
import { increaseTo } from '@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time';


const fs = require('fs');

function getRandomBigInt(min: bigint, max: bigint): bigint {
  const range = max - min + 1n;
  const randomBigInt = BigInt(Math.floor(Number(range) * Math.random()));
  return min + randomBigInt;
}


describe('TokenDistributor', () => {
  it('should distribute a token', async () => {
    const { tokenDistributor, tokenDistributorAddress, ldt, owner } = await loadFixture(tokenDistributorFixture);

    // const filePath = `./distribution-${new Date().getTime()}.csv`;
    // fs.closeSync(fs.openSync(filePath, 'w'));

    await ldt.approve(tokenDistributorAddress, 4_500_000_000n * (10n ** 18n));

    const deposit = await tokenDistributor.deposit([
      { amount: 2_025_000_000n * (10n ** 18n), emitted: 0n, rate: 5_547_945n * (10n ** 18n), cadence: 86400n },
      { amount: 1_125_000_000n * (10n ** 18n), emitted: 0n, rate: 3_082_191n * (10n ** 18n), cadence: 86400n },
      { amount: 675_000_000n * (10n ** 18n), emitted: 0n, rate: 1_849_315n * (10n ** 18n), cadence: 86400n },
      { amount: 675_000_000n * (10n ** 18n), emitted: 0n, rate: 924_657n * (10n ** 18n), cadence: 86400n },
    ]);

    let block = await deposit.getBlock();
    let time = block?.timestamp ?? 0;

    await increaseTo(time + 86400);

    while (await ldt.balanceOf(tokenDistributorAddress) > 0n) {
      const distribution = await tokenDistributor.distribute();

      const balance = await ldt.balanceOf(owner);
      const currentDistribution = await tokenDistributor.currentDistribution();
      const distributions = await tokenDistributor.distributions(currentDistribution);


      const randomBigInt = getRandomBigInt(0n, distributions.rate / 2n);

      block = await distribution.getBlock();
      time = block?.timestamp ?? 0;

      await increaseTo(time + 86400);

      // appendFileSync(filePath, `${balance.toString()},${distributions.rate},${currentDistribution}\n`);
    }
  });

  it('must revert when the balance is over', async () => {
    const { tokenDistributor, tokenDistributorAddress, ldt, owner } = await loadFixture(tokenDistributorFixture);

    await ldt.approve(tokenDistributorAddress, 4000n);

    const deposit = await tokenDistributor.deposit([
      { amount: 1000n, emitted: 0n, rate: 50n, cadence: 86400n },
      { amount: 1000n, emitted: 0n, rate: 20n, cadence: 86400n },
      { amount: 1000n, emitted: 0n, rate: 10n, cadence: 86400n },
      { amount: 1000n, emitted: 0n, rate: 1n, cadence: 86400n },
    ]);

    let block = await deposit.getBlock();
    let time = block?.timestamp ?? 0;

    await increaseTo(time + 86400);

    while (await ldt.balanceOf(tokenDistributorAddress) > 0n) {
      const distribution = await tokenDistributor.distribute();

      block = await distribution.getBlock();
      time = block?.timestamp ?? 0;

      await increaseTo(time + 86400);
    }

    await expect(tokenDistributor.distribute()).revertedWith('DISTRIBUTED');

    await ldt.transfer(tokenDistributorAddress, 100n)

    while (await ldt.balanceOf(tokenDistributorAddress) > 0n) {
      const distribution = await tokenDistributor.distribute();

      block = await distribution.getBlock();
      time = block?.timestamp ?? 0;

      await increaseTo(time + 86400);
    }

    await expect(tokenDistributor.distribute()).revertedWith('DISTRIBUTED');
  });
});
