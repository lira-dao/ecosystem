// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '../libs/RewardsLibrary.sol';

interface ITeamSplitter {
    function calculate(uint _ldt, uint _ldtLiquidity, uint _tb, uint _tbbLiquidity, uint _tbsLiquidity, uint _tbgLiquidity) external view returns (RewardsLibrary.TeamRewardsAmounts memory rewards);
}
