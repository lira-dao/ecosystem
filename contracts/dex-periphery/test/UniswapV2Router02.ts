import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { dexRouterFixture } from '../fixtures';

describe('UniswapV2Router02', () => {
  it('should return amounts out', async () => {
    const { dexRouter, ldtAddress, wethAddress } = await loadFixture(dexRouterFixture);

    await dexRouter.getAmountsOut(1000000000000000000n, [ldtAddress, wethAddress])
  });
});
