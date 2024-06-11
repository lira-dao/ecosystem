import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { dexFactoryFixture } from '../fixtures';
import hre from 'hardhat';


const token0 = '0x0000000000000000000000000000000000000001';
const token1 = '0x0000000000000000000000000000000000000002';


describe('UniswapV2Factory', () => {
  it('must have a dao address', async () => {
    const { dexFactory, deployer } = await loadFixture(dexFactoryFixture);

    expect(await dexFactory.dao()).eq(deployer);
  });

  it('deployer can set the dao address', async () => {
    const { dexFactory, dao } = await loadFixture(dexFactoryFixture);

    await dexFactory.setDao(dao);

    expect(await dexFactory.dao()).eq(dao);
  });

  it('revert if user try to change dao', async () => {
    const { dexFactory, user } = await loadFixture(dexFactoryFixture);

    // @ts-ignore
    await expect(dexFactory.connect(user).setDao(user)).revertedWith('LIRA_DEX_ONLY_DAO');
  });

  it('dao can create new pools when onlyDaoCanOpen is true', async () => {
    const { dexFactory } = await loadFixture(dexFactoryFixture);

    await dexFactory.createPair(token0, token1);

    expect(await dexFactory.allPairsLength()).eq(1);

    const pair = await dexFactory.allPairs(0);
    const pairContract = await hre.ethers.getContractAt('UniswapV2Pair', pair);

    expect(await pairContract.token0()).eq(token0);
    expect(await pairContract.token1()).eq(token1);
  });

  it('revert if user try to create a new pool when onlyDaoCanOpen is true', async () => {
    const { dexFactory, dao, user } = await loadFixture(dexFactoryFixture);

    expect(await dexFactory.onlyDaoCanOpen()).eq(true);

    // @ts-ignore
    await expect(dexFactory.connect(user).createPair(token0, token1)).revertedWith('LIRA_DEX_ONLY_DAO');
  });

  it('users can create new pools when nlyDaoCanOpen is false', async () => {
    const { dexFactory, dao, user } = await loadFixture(dexFactoryFixture);

    expect(await dexFactory.onlyDaoCanOpen()).eq(true);

    await dexFactory.setOnlyDaoCanOpen(false);

    expect(await dexFactory.onlyDaoCanOpen()).eq(false);

    // @ts-ignore
    await dexFactory.connect(user).createPair(token0, token1);

    const pair = await dexFactory.allPairs(0);
    const pairContract = await hre.ethers.getContractAt('UniswapV2Pair', pair);

    expect(await pairContract.token0()).eq(token0);
    expect(await pairContract.token1()).eq(token1);
  });
});
