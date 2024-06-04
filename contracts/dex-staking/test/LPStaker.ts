import { lpStakerFixture } from '../fixtures';
import { expect } from 'chai';


describe('LPStaker', () => {
  it('Should deploy mock tokens', async () => {
    const { lp, token1, token2 } = await lpStakerFixture();

    expect(await lp.name()).to.equal('LP');
    expect(await lp.symbol()).to.equal('LP');

    expect(await token1.name()).to.equal('Token1');
    expect(await token1.symbol()).to.equal('T1');

    expect(await token2.name()).to.equal('Token2');
    expect(await token2.symbol()).to.equal('T2');
  });
});
