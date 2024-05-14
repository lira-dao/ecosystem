import hre from 'hardhat';
import { MockWBTC, MockWETH } from '../typechain-types';
import WBTCArtifact from '../artifacts/contracts/MockWBTC.sol/MockWBTC.json';
import WETHArtifact from '../artifacts/contracts/MockWETH.sol/MockWETH.json';


export async function mockWbtcFixture() {
  const [owner] = await hre.ethers.getSigners();

  const wbtcFactory = new hre.ethers.ContractFactory<[], MockWBTC>(WBTCArtifact.abi, WBTCArtifact.bytecode, owner);
  const wbtc = await wbtcFactory.deploy();

  return { wbtc };
}

export async function mockWethFixture() {
  const [owner] = await hre.ethers.getSigners();

  const wethFactory = new hre.ethers.ContractFactory<[], MockWETH>(WETHArtifact.abi, WETHArtifact.bytecode, owner);
  const weth = await wethFactory.deploy();

  return { weth, owner };
}
