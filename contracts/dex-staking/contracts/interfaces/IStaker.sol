// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


interface IStaker {
    struct Staker {
        uint256 amount;
        uint256 lastRewardRound;
    }

    function distributeRewards(uint256 rewardAmount1, uint256 rewardAmount2) external;
    function getStakerAmount(address staker) external view returns (uint);
    function pendingRewards(address user) external view returns (uint rewardAmount1, uint rewardAmount2);
    function rewardRoundsLength() external pure returns (uint256);
    function stakers(address staker) external view returns (Staker memory);
    function token() external view returns (address);
    function totalStaked() external view returns (uint256);
    function unstake(uint amount) external;
}
