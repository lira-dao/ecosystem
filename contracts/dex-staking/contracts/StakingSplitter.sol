// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@lira-dao/treasury-tokens/contracts/interfaces/ITreasuryToken.sol';
import './interfaces/IStaker.sol';
import './libs/RewardsLibrary.sol';

/**
 * @title Staking Splitter V1
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract StakingSplitter is Ownable2Step {
    address public ldt;
    address public tbb;
    address public tbs;
    address public tbg;
    address[] public stakers;

    RewardsLibrary.RewardRate public tbbRewardRate = RewardsLibrary.RewardRate(200, 200);
    RewardsLibrary.RewardRate public tbsRewardRate = RewardsLibrary.RewardRate(500, 500);
    RewardsLibrary.RewardRate public tbgRewardRate = RewardsLibrary.RewardRate(1000, 1000);

    uint public constant MIN_RATE = 1;
    uint public constant MAX_RATE = 100_000;

    constructor(address _ldt, address _tbb, address _tbs, address _tbg, address[] memory _stakers) Ownable(msg.sender) {
        ldt = _ldt;
        tbb = _tbb;
        tbs = _tbs;
        tbg = _tbg;
        stakers = _stakers;
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

        rewards.tbb.liquidity = calculateReward(stakers[0], ITreasuryToken(tbb).rate(), tbbRewardRate);
        rewards.tbs.liquidity = calculateReward(stakers[1], ITreasuryToken(tbs).rate(), tbsRewardRate);
        rewards.tbg.liquidity = calculateReward(stakers[2], ITreasuryToken(tbg).rate(), tbgRewardRate);

        uint totalLdt = rewards.tbb.liquidity.ldt + rewards.tbs.liquidity.ldt + rewards.tbg.liquidity.ldt;

        if (totalLdt > _ldt) {
            uint tbbLiquidity = rewards.tbb.liquidity.ldtLiquidity;
            uint tbsLiquidity = rewards.tbs.liquidity.ldtLiquidity;
            uint tbgLiquidity = rewards.tbg.liquidity.ldtLiquidity;
            uint totalLiquidity = tbbLiquidity + tbsLiquidity + tbgLiquidity;

            rewards.tbb.ldt = (tbbLiquidity * _ldt) / totalLiquidity;
            rewards.tbs.ldt = (tbsLiquidity * _ldt) / totalLiquidity;
            rewards.tbg.ldt = (tbgLiquidity * _ldt) / totalLiquidity;
        } else {
            rewards.tbb.ldt = rewards.tbb.liquidity.ldt;
            rewards.tbs.ldt = rewards.tbs.liquidity.ldt;
            rewards.tbg.ldt = rewards.tbg.liquidity.ldt;
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

    function calculateReward(address _staker, uint _tokenRate, RewardsLibrary.RewardRate memory _rate) private view returns (RewardsLibrary.Reward memory) {
        uint liquidity = IStaker(_staker).totalStaked() / 2;

        return RewardsLibrary.Reward(
            ((liquidity * _tokenRate) * _rate.ldt) / MAX_RATE,
            (liquidity * _rate.tb) / MAX_RATE,
            liquidity * _tokenRate,
            liquidity
        );
    }
}
