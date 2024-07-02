// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


interface IStaker {
    struct Staker {
        uint256 amount;
        uint256 lastRewardRound;
    }

    function totalStaked() external view returns (uint256);

    function token() external view returns (address);

    function distributeRewards(uint256 rewardAmount1, uint256 rewardAmount2) external;

    function stakers(address staker) external returns (Staker memory);

    function unstake(uint amount) external;
}
