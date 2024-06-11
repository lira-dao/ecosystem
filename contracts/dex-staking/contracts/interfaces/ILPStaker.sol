// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './IUniswapV2Pair.sol';


interface ILPStaker {
    function totalStaked() external view returns (uint256);

    function lpToken() external view returns (address);

    function distributeRewards(uint256 rewardAmount1, uint256 rewardAmount2) external;
}
