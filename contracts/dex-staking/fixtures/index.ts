import { mockTokenFixture } from '@lira-dao/mock-tokens/fixtures';
import hre from 'hardhat';


export async function lpStakerFixture() {
  const [owner, user1, user2, user3] = await hre.ethers.getSigners();

  const { token: lp, tokenAddress: lpAddress } = await mockTokenFixture('LP', 'LP');
  const { token: token1, tokenAddress: token1Address } = await mockTokenFixture('Token1', 'T1');
  const { token: token2, tokenAddress: token2Address } = await mockTokenFixture('Token2', 'T2');

  const baseFaucetContract = await hre.ethers.getContractFactory('LPStakerV3');
  const staker = await baseFaucetContract.deploy(lpAddress, token1Address, token2Address);
  const stakerAddress = await staker.getAddress();


  return {
    staker,
    stakerAddress,
    lp,
    lpAddress,
    token1,
    token1Address,
    token2,
    token2Address,
    owner,
    user1,
    user2,
    user3,
  };
}
