// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './interfaces/ILPStaker.sol';
import './interfaces/IUniswapV2Pair.sol';


contract RewardSplitter is Ownable2Step {
    address public rewardToken;

    ILPStaker[] public farms;

    constructor(address _rewardToken) Ownable(msg.sender) {
        rewardToken = _rewardToken;
    }

    function calculateStakingLiquidity(address _farm) public view returns (uint256, uint256) {
        uint256 totalStaked = ILPStaker(_farm).totalStaked();
        IUniswapV2Pair lpToken = ILPStaker(_farm).lpToken();

        address token0 = lpToken.token0();
        address token1 = lpToken.token1();

        (address token0, address token1) = lpToken.token0() == rewardToken ? (lpToken.token0(), lpToken.token1()) : (lpToken.token1(), lpToken.token0());

        return (IERC20(token0).balanceOf(lpToken), IERC20(token1).balanceOf(lpToken));
    }

    function addFarm(address _farm) public onlyOwner {
        IUniswapV2Pair lpToken = ILPStaker(_farm).lpToken();

        address token0 = lpToken.token0();
        address token1 = lpToken.token1();

        require(token0 == rewardToken || token1 == rewardToken, 'INVALID_FARM');

        farms.push(ILPStaker(_farm));
    }
}
