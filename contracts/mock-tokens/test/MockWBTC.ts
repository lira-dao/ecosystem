import { mockWbtcFixture } from '../fixtures';
import { expect } from 'chai';

describe('MockWBTC', () => {
  it('must have "Wrapped BTC" as name', async () => {
    const { wbtc } = await mockWbtcFixture();

    expect(await wbtc.name()).eq('Wrapped BTC');
  });

  it('must have "WBTC" as symbol', async () => {
    const { wbtc } = await mockWbtcFixture();

    expect(await wbtc.symbol()).eq('WBTC');
  });

  it('must have 8 decimals', async () => {
    const { wbtc } = await mockWbtcFixture();

    expect(await wbtc.decimals()).eq(8);
  });
});
