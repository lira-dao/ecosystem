import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { dexFactoryFixture } from '../fixtures';

describe('UniswapV2Factory', () => {
  it('must have a dao address', async () => {
    const { dexFactory, deployer } = await loadFixture(dexFactoryFixture);

    expect(await dexFactory.dao()).eq(deployer);
  });

  it('only dao address can change the dao address', async () => {

  });
});
