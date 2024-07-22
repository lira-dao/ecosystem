// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IUniswapV2Pair {
    function transferFrom(address from, address to, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function balanceOf(address owner) external view returns (uint);
    function token0() external view returns (address);
    function token1() external view returns (address);
}
