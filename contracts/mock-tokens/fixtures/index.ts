import hre from 'hardhat';
import { MockToken, MockWBTC, MockWETH } from '../typechain-types';
import WBTCArtifact from '../artifacts/contracts/MockWBTC.sol/MockWBTC.json';
import WETHArtifact from '../artifacts/contracts/MockWETH.sol/MockWETH.json';
import MockTokenArtifact from '../artifacts/contracts/MockToken.sol/MockToken.json';


export async function mockWbtcFixture() {
  const [owner] = await hre.ethers.getSigners();

  const wbtcFactory = new hre.ethers.ContractFactory<[], MockWBTC>(WBTCArtifact.abi, WBTCArtifact.bytecode, owner);
  const wbtc = await wbtcFactory.deploy();
  const wbtcAddress = await wbtc.getAddress();

  return { wbtc, wbtcAddress };
}

export async function mockWethFixture() {
  const [owner] = await hre.ethers.getSigners();

  const wethFactory = new hre.ethers.ContractFactory<[], MockWETH>(WETHArtifact.abi, WETHArtifact.bytecode, owner);
  const weth = await wethFactory.deploy();
  const wethAddress = await weth.getAddress();

  return { weth, wethAddress, owner };
}

export async function mockTokenFixture(name: string, symbol: string) {
  const [owner] = await hre.ethers.getSigners();

  const tokenFactory = new hre.ethers.ContractFactory<[string, string], MockToken>(MockTokenArtifact.abi, MockTokenArtifact.bytecode, owner);
  const token = await tokenFactory.deploy(name, symbol);
  const tokenAddress = await token.getAddress();

  return { token, tokenAddress, owner };
}
