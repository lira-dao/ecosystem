import hre from 'hardhat';

export async function dexFactoryFixture() {
  const [deployer, dao] = await hre.ethers.getSigners();

  const dexFactoryContract = await hre.ethers.getContractFactory('UniswapV2Factory');
  const dexFactory = await dexFactoryContract.deploy();
  const dexFactoryAddress = await dexFactory.getAddress();

  return { dexFactory, dexFactoryAddress, deployer, dao };
}
