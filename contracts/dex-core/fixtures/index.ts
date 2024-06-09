import hre from 'hardhat';
import { UniswapV2Factory, UniswapV2Pair } from '../typechain-types';

import UniswapV2FactoryArtifact from '../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Factory.json';
import UniswapV2PairArtifact from '../artifacts/contracts/UniswapV2Pair.sol/UniswapV2Pair.json';


export async function dexFactoryFixture() {
  const [deployer, dao, user] = await hre.ethers.getSigners();

  const dexFactoryContract = new hre.ethers.ContractFactory<[], UniswapV2Factory>(UniswapV2FactoryArtifact.abi, UniswapV2FactoryArtifact.bytecode, deployer);
  const dexFactory = await dexFactoryContract.deploy();
  const dexFactoryAddress = await dexFactory.getAddress();

  const dexPairFactory = new hre.ethers.ContractFactory<[], UniswapV2Pair>(UniswapV2PairArtifact.abi, UniswapV2PairArtifact.bytecode, deployer);

  // console.log('pairCodeHash', await dexFactory.pairCodeHash());

  return { dexFactory, dexFactoryAddress, deployer, dao, user, dexPairFactory };
}
