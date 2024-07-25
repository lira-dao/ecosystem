import { rewardSplitterV2Fixture } from '../fixtures';
import { expect } from 'chai';
import { parseUnits } from 'ethers';
import { increase, increaseTo } from '@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time';


describe('TimelockTokenStaker', () => {
  it('should have a token address', async () => {
    const { tbbTimelockStaker, tbbAddress } = await rewardSplitterV2Fixture();

    expect(await tbbTimelockStaker.token()).eq(tbbAddress);
  });

  it('should have a rewardToken1 address', async () => {
    const { tbbTimelockStaker, ldtAddress } = await rewardSplitterV2Fixture();

    expect(await tbbTimelockStaker.rewardToken1()).eq(ldtAddress);
  });

  it('should have a rewardToken2 address', async () => {
    const { tbbTimelockStaker, tbbAddress } = await rewardSplitterV2Fixture();

    expect(await tbbTimelockStaker.rewardToken2()).eq(tbbAddress);
  });

  it('user should lock token for 6 months', async () => {
    const { tbbTimelockStaker, tbbTimelockStakerAddress, tbb, deployer, ldt } = await rewardSplitterV2Fixture();

    const stakeAmount = parseUnits('1');

    await tbb.mint(deployer, stakeAmount);
    await tbb.approve(tbbTimelockStakerAddress, stakeAmount);
    const stake = await tbbTimelockStaker.stake(stakeAmount);

    const block = await stake.getBlock();
    const time = block?.timestamp ?? 0;
    const unlockTime = time + 24 * 7 * 24 * 60 * 60;

    const staker = await tbbTimelockStaker.stakers(deployer);

    expect(staker.amount).eq(stakeAmount);
    expect(staker.lastRewardRound).eq(0);
    expect(staker.unlockTime).eq(unlockTime);

    await expect(tbbTimelockStaker.unstake(stakeAmount)).revertedWith('LOCKED');

    await increaseTo(unlockTime - 2);

    // this transaction have timestamp unlockTime - 1
    await expect(tbbTimelockStaker.unstake(stakeAmount)).revertedWith('LOCKED');

    await increase(1);

    await expect(tbbTimelockStaker.unstake(stakeAmount)).not.reverted;

    expect(await tbb.balanceOf(deployer)).eq(stakeAmount);
  });
});
