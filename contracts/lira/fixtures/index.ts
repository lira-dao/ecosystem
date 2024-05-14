import { mockWbtcFixture } from '@lira-dao/mock-tokens/fixtures';
import hre from 'hardhat';
import { LIRA } from '../typechain-types';
import LIRAArtifact from '../artifacts/contracts/LIRA.sol/LIRA.json';

export async function liraFixture() {
  const { wbtc } = await mockWbtcFixture();

  const [owner, minter, feeVault] = await hre.ethers.getSigners();

  const liraFactory = new hre.ethers.ContractFactory<[string], LIRA>(LIRAArtifact.abi, LIRAArtifact.bytecode, owner);
  const lira = await liraFactory.deploy(await wbtc.getAddress());
  const liraAddress = await lira.getAddress();
  await lira.setFeeVault(feeVault);

  return { lira, liraAddress, wbtc, owner, minter, feeVault };
}
