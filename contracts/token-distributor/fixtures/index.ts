import hre from 'hardhat';
import { TokenDistributor } from '../typechain-types';
import TokenDistributorArtifact from '../artifacts/contracts/TokenDistributor.sol/TokenDistributor.json';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { liraDaoTokenFixture } from '@lira-dao/ldt/fixtures';

export const tokenDistributorFactory = new hre.ethers.ContractFactory<[string], TokenDistributor>(TokenDistributorArtifact.abi, TokenDistributorArtifact.bytecode);

export async function tokenDistributorFixture() {
  const [owner] = await hre.ethers.getSigners();
  const { ldt, ldtAddress, vault } = await loadFixture(liraDaoTokenFixture);

  // @ts-ignore
  await ldt.connect(vault).transfer(owner, 4_500_000_000n * (10n ** 18n));

  const tokenDistributor = await tokenDistributorFactory.connect(owner).deploy(ldtAddress);
  const tokenDistributorAddress = await tokenDistributor.getAddress();

  return { tokenDistributor, tokenDistributorAddress, tokenDistributorFactory, ldt, owner };
}
