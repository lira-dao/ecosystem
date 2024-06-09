// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@lira-dao/token-distributor/contracts/interfaces/IDistributor.sol';
import './interfaces/ILPStaker.sol';
import './interfaces/IUniswapV2Pair.sol';
import 'hardhat/console.sol';


contract RewardSplitter is Ownable2Step {
    address public rewardToken;
    address public distributor;

    address[] public farms;

    constructor(address _rewardToken, address _distributor) Ownable(msg.sender) {
        rewardToken = _rewardToken;
        distributor = _distributor;
    }

    function requestDistribution() external onlyOwner {
        IDistributor(distributor).distribute();
    }

    function calculateStakingLiquidity(address _farm) public view returns (uint256, uint256) {
        uint256 totalStaked = ILPStaker(_farm).totalStaked();
        address lpToken = ILPStaker(_farm).lpToken();
        uint256 lpTotalSupply = IERC20(lpToken).totalSupply();

        address t0 = IUniswapV2Pair(lpToken).token0();
        address t1 = IUniswapV2Pair(lpToken).token1();

        (address token0, address token1) = t0 == rewardToken ? (t0, t1) : (t1, t0);
        require(token0 == rewardToken, 'INVALID_REWARD_TOKEN');

        uint balance0 = IERC20(token0).balanceOf(lpToken);
        uint balance1 = IERC20(token1).balanceOf(lpToken);
        console.log('totalStaked', totalStaked / 1e18);
        console.log('lpTotalSupply', lpTotalSupply / 1e18);
        console.log('balances', balance0 / 1e18, balance1 / 1e18);

        uint amount0 = (totalStaked * balance0) / lpTotalSupply;
        uint amount1 = (totalStaked * balance1) / lpTotalSupply;

        console.log('amounts', amount0, amount1);
        return ((amount0 * 10) / 1000, (amount1 * 10) / 1000);
    }

    function addFarm(address _farm) public onlyOwner {
        address lpToken = ILPStaker(_farm).lpToken();

        address t0 = IUniswapV2Pair(lpToken).token0();
        address t1 = IUniswapV2Pair(lpToken).token1();

        require(t0 == rewardToken || t1 == rewardToken, 'INVALID_FARM');

        farms.push(_farm);
    }

    // TODO: set distributor
}
