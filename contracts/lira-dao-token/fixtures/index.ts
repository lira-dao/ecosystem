import hre from 'hardhat';
import { LDT } from '../typechain-types';

import LDTArtifact from '../artifacts/contracts/LTD.sol/LDT.json';

export async function liraDaoTokenFixture() {
  const [owner, vault, team, marketing, liquidity, presale] = await hre.ethers.getSigners();

  const ldtFactory = new hre.ethers.ContractFactory<[string, string, string, string, string], LDT>(LDTArtifact.abi, LDTArtifact.bytecode, owner);

  const ldt = await ldtFactory.deploy(vault.address, team.address, marketing.address, liquidity.address, presale.address);
  const ldtAddress = await ldt.getAddress();

  return { ldt, ldtAddress, owner, vault, team, marketing, liquidity, presale };
}
