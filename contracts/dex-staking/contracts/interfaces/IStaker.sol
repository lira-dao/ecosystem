// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


interface IStaker {
    function totalStaked() external view returns (uint256);

    function token() external view returns (address);

    function distributeRewards(uint256 rewardAmount1, uint256 rewardAmount2) external;
}
