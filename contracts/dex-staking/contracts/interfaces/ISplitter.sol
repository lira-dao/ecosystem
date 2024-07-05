// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '../libs/RewardsLibrary.sol';

interface ISplitter {
    function calculate(uint _ldt, uint _tb) external view returns (RewardsLibrary.RewardsAmounts memory rewards);
}
