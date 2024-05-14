import hre from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { liraDaoTokenFixture } from '@lira-dao/token/fixtures';


export async function baseFaucetFixture() {
  const [owner, vault, team, marketing, liquidity, presale, user] = await hre.ethers.getSigners();

  const { ldt, ldtAddress } = await loadFixture(liraDaoTokenFixture);

  const baseFaucetContract = await hre.ethers.getContractFactory('BaseFaucet');
  const baseFaucet = await baseFaucetContract.deploy(ldtAddress);
  const baseFaucetAddress = await baseFaucet.getAddress();

  return { baseFaucet, baseFaucetAddress, ldt, ldtAddress, owner, user, vault };
}
