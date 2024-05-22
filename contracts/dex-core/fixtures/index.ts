import hre from 'hardhat';
import { UniswapV2Factory } from '../typechain-types';

import UniswapV2FactoryArtifact from '../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Factory.json';


export async function dexFactoryFixture() {
  const [deployer, dao, user] = await hre.ethers.getSigners();

  const dexFactoryContract = new hre.ethers.ContractFactory<[], UniswapV2Factory>(UniswapV2FactoryArtifact.abi, UniswapV2FactoryArtifact.bytecode, deployer);
  const dexFactory = await dexFactoryContract.deploy();
  const dexFactoryAddress = await dexFactory.getAddress();


  return { dexFactory, dexFactoryAddress, deployer, dao, user };
}
