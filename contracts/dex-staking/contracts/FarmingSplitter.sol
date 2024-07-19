// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@lira-dao/treasury-tokens/contracts/interfaces/ITreasuryToken.sol';
import './interfaces/IUniswapV2Pair.sol';
import './interfaces/ILPStaker.sol';
import './libs/RewardsLibrary.sol';

/**
 * @title Farming Splitter V1
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract FarmingSplitter is Ownable2Step {
    address public ldt;
    address public tbb;
    address public tbs;
    address public tbg;
    address[] public farms;

    RewardsLibrary.RewardRate public tbbRewardRate = RewardsLibrary.RewardRate(200, 200);
    RewardsLibrary.RewardRate public tbsRewardRate = RewardsLibrary.RewardRate(500, 500);
    RewardsLibrary.RewardRate public tbgRewardRate = RewardsLibrary.RewardRate(1000, 1000);

    uint public constant MIN_RATE = 1;
    uint public constant MAX_RATE = 100_000;

    constructor(address _ldt, address _tbb, address _tbs, address _tbg, address[] memory _farms) Ownable(msg.sender) {
        ldt = _ldt;
        tbb = _tbb;
        tbs = _tbs;
        tbg = _tbg;
        farms = _farms;
    }

    function setTbbRewardRate(RewardsLibrary.RewardRate memory _tbbRewardRate) external onlyOwner {
        tbbRewardRate = _tbbRewardRate;
    }

    function setTbsRewardRate(RewardsLibrary.RewardRate memory _tbsRewardRate) external onlyOwner {
        tbsRewardRate = _tbsRewardRate;
    }

    function setTbgRewardRate(RewardsLibrary.RewardRate memory _tbgRewardRate) external onlyOwner {
        tbgRewardRate = _tbgRewardRate;
    }

    function calculate(uint _ldt, uint _tb) external view returns (RewardsLibrary.RewardsAmounts memory rewards) {
        uint tbbReward = (_tb * 20) / 100;
        uint tbsReward = (_tb * 30) / 100;
        uint tbgReward = _tb - tbbReward - tbsReward;

        rewards.tbb.liquidity = calculateReward(farms[0], tbbRewardRate);
        rewards.tbs.liquidity = calculateReward(farms[1], tbsRewardRate);
        rewards.tbg.liquidity = calculateReward(farms[2], tbgRewardRate);

        uint totalLdt = rewards.tbb.liquidity.ldtLiquidity + rewards.tbs.liquidity.ldtLiquidity + rewards.tbg.liquidity.ldtLiquidity;

        if (totalLdt > _ldt) {
            uint tbbLiquidity = getLdtLiquidity(farms[0]);
            uint tbsLiquidity = getLdtLiquidity(farms[1]);
            uint tbgLiquidity = getLdtLiquidity(farms[2]);
            uint totalLiquidity = tbbLiquidity + tbsLiquidity + tbgLiquidity;

            rewards.tbb.ldt = (tbbLiquidity * _ldt) / totalLiquidity;
            rewards.tbs.ldt = (tbsLiquidity * _ldt) / totalLiquidity;
            rewards.tbg.ldt = (tbgLiquidity * _ldt) / totalLiquidity;
        } else {
            rewards.tbb.ldt = rewards.tbb.liquidity.ldt;
            rewards.tbs.ldt = rewards.tbb.liquidity.ldt;
            rewards.tbg.ldt = rewards.tbb.liquidity.ldt;
        }

        if (rewards.tbb.liquidity.tb > tbbReward / ITreasuryToken(tbb).rate()) {
            rewards.tbb.tb = tbbReward / ITreasuryToken(tbb).rate();
        } else {
            rewards.tbb.tb = rewards.tbb.liquidity.tb;
        }

        if (rewards.tbs.liquidity.tb > tbsReward / ITreasuryToken(tbs).rate()) {
            rewards.tbs.tb = tbsReward / ITreasuryToken(tbs).rate();
        } else {
            rewards.tbs.tb = rewards.tbs.liquidity.tb;
        }

        if (rewards.tbg.liquidity.tb > tbgReward / ITreasuryToken(tbg).rate()) {
            rewards.tbg.tb = tbgReward / ITreasuryToken(tbg).rate();
        } else {
            rewards.tbg.tb = rewards.tbg.liquidity.tb;
        }

        return rewards;
    }

    function calculateReward(address _farm, RewardsLibrary.RewardRate memory _rate) private view returns (RewardsLibrary.Reward memory) {
        uint256 totalStaked = ILPStaker(_farm).totalStaked();
        address lpToken = ILPStaker(_farm).lpToken();
        uint256 lpTotalSupply = IERC20(lpToken).totalSupply();

        address t0 = IUniswapV2Pair(lpToken).token0();
        address t1 = IUniswapV2Pair(lpToken).token1();

        (address token0, address token1) = t0 == ldt ? (t0, t1) : (t1, t0);
        require(token0 == ldt, 'INVALID_TOKEN');

        uint balance0 = IERC20(token0).balanceOf(lpToken);
        uint balance1 = IERC20(token1).balanceOf(lpToken);

        uint amount0 = (totalStaked * balance0) / lpTotalSupply;
        uint amount1 = (totalStaked * balance1) / lpTotalSupply;

        return RewardsLibrary.Reward(
            (amount0 * _rate.ldt) / MAX_RATE,
            (amount1 * _rate.tb) / MAX_RATE,
            amount0,
            amount1
        );
    }

    function getLdtLiquidity(address _farm) private view returns (uint256 liquidity) {
        address lpToken = ILPStaker(_farm).lpToken();

        liquidity = IERC20(ldt).balanceOf(lpToken);
    }
}
