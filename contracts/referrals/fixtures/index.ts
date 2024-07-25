import hre from 'hardhat';
import { liraDaoTokenFixture } from '@lira-dao/ldt/fixtures';
import {
  treasuryBondBronzeFactory,
  treasuryBondBronzeRate,
  treasuryBondGoldFactory,
  treasuryBondGoldRate,
  treasuryBondSilverFactory,
  treasuryBondSilverRate,
} from '@lira-dao/treasury-tokens/fixtures';


export async function referralsFixture() {
  const [deployer, user1, user2] = await hre.ethers.getSigners();
  const { ldt, ldtAddress } = await liraDaoTokenFixture();

  // @ts-ignore
  await ldt.connect(user1).transfer(deployer, await ldt.balanceOf(user1));

  const tbb = await treasuryBondBronzeFactory.connect(deployer).deploy(ldtAddress, treasuryBondBronzeRate);
  const tbbAddress = await tbb.getAddress();

  const tbs = await treasuryBondSilverFactory.connect(deployer).deploy(ldtAddress, treasuryBondSilverRate);
  const tbsAddress = await tbs.getAddress();

  const tbg = await treasuryBondGoldFactory.connect(deployer).deploy(ldtAddress, treasuryBondGoldRate);
  const tbgAddress = await tbg.getAddress();

  const referralsFactory = await hre.ethers.getContractFactory('Referrals');

  const referrals = await referralsFactory.deploy(ldtAddress, tbbAddress, tbsAddress, tbgAddress);
  const referralsAddress = await referrals.getAddress();

  return {
    deployer,
    ldt,
    ldtAddress,
    referrals,
    referralsAddress,
    tbb,
    tbbAddress,
    tbg,
    tbgAddress,
    tbs,
    tbsAddress,
    user1,
    user2,
  };
}
