import hre from 'hardhat';
import { liraDaoTokenFixture } from '@lira-dao/ldt/fixtures';


export async function referralsFixtures() {
  const { ldtAddress } = await liraDaoTokenFixture();

  const referralsFactory = await hre.ethers.getContractFactory('Referrals');

  const referrals = await referralsFactory.deploy(ldtAddress);
  const referralsAddress = await referrals.getAddress()

  return {
    ldtAddress,
    referrals,
    referralsAddress,
  }
}
