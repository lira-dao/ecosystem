import hre from 'hardhat';
import { liraDaoTokenFixture } from '@lira-dao/ldt/fixtures';


export async function referralsFixture() {
  const [deployer, user1, user2] = await hre.ethers.getSigners();
  const { ldtAddress } = await liraDaoTokenFixture();

  const referralsFactory = await hre.ethers.getContractFactory('Referrals');

  const referrals = await referralsFactory.deploy(ldtAddress);
  const referralsAddress = await referrals.getAddress();

  return {
    deployer,
    ldtAddress,
    referrals,
    referralsAddress,
    user1,
    user2,
  };
}
