// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ITreasuryToken {
    function mint(address to, uint256 amount) external;
    function rate() external returns (uint);
    function quoteMint(uint256 amount) external view returns (uint256 total, uint256 cost, uint256 fee);
}
