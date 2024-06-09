import hre from 'hardhat';
import { dexRouterFixture } from '@lira-dao/dex-periphery/fixtures';
import { tokenDistributorFixture } from '@lira-dao/token-distributor/fixtures';


export async function lpStakerFixture() {
  const [owner, user1, user2, user3] = await hre.ethers.getSigners();

  const { tbbPairAddress, ldtAddress, tbbAddress, ...router } = await dexRouterFixture();

  const baseFaucetContract = await hre.ethers.getContractFactory('LPStakerV3');
  const staker = await baseFaucetContract.deploy(tbbPairAddress, ldtAddress, tbbAddress);
  const stakerAddress = await staker.getAddress();

  return {
    ...router,
    ldtAddress,
    owner,
    staker,
    stakerAddress,
    tbbAddress,
    tbbPairAddress,
    user1,
    user2,
    user3,
  };
}

export async function rewardSplitterFixture() {
  const { tbbPairAddress, ldtAddress, ...lpStaker } = await lpStakerFixture();

  const { tokenDistributorFactory } = await tokenDistributorFixture();

  const tokenDistributor = await tokenDistributorFactory.deploy(ldtAddress);
  const tokenDistributorAddress = await tokenDistributor.getAddress();

  const rewardSplitterFactory = await hre.ethers.getContractFactory('RewardSplitter');
  const rewardSplitter = await rewardSplitterFactory.deploy(ldtAddress, tokenDistributorAddress);
  const rewardSplitterAddress = await rewardSplitter.getAddress();

  return { ...lpStaker, rewardSplitter, rewardSplitterAddress, ldtAddress, tbbPairAddress };
}
