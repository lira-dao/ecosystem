// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@lira-dao/treasury-tokens/contracts/interfaces/ITreasuryToken.sol';
import './libs/RewardsLibrary.sol';

/**
 * @title Team Splitter V1
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract TeamSplitter is Ownable2Step {
    address public tbb;
    address public tbs;
    address public tbg;

    uint public constant MIN_RATE = 1;
    uint public constant MAX_RATE = 100_000;

    RewardsLibrary.RewardRate public rewardRate = RewardsLibrary.RewardRate(1000, 1000);

    constructor(address _tbb, address _tbs, address _tbg) Ownable(msg.sender) {
        tbb = _tbb;
        tbs = _tbs;
        tbg = _tbg;
    }

    function calculate(uint _ldt, uint _ldtLiquidity, uint _tb, uint _tbbLiquidity, uint _tbsLiquidity, uint _tbgLiquidity) external returns (RewardsLibrary.TeamRewardsAmounts memory rewards) {
        uint tbbReward = (_tb * 20) / 100;
        uint tbsReward = (_tb * 30) / 100;
        uint tbgReward = _tb - tbbReward - tbsReward;

        uint teamLdtReward = (_ldtLiquidity * rewardRate.ldt) / MAX_RATE;

        if (teamLdtReward < _ldt) {
            rewards.ldt = teamLdtReward;
        } else {
            rewards.ldt = _ldt;
        }

        if ((_tbbLiquidity * rewardRate.tb) / MAX_RATE > tbbReward / ITreasuryToken(tbb).rate()) {
            rewards.tbb = tbbReward / ITreasuryToken(tbb).rate();
        } else {
            rewards.tbb = (_tbbLiquidity * rewardRate.tb) / MAX_RATE;
        }

        if ((_tbsLiquidity * rewardRate.tb) / MAX_RATE > tbsReward / ITreasuryToken(tbs).rate()) {
            rewards.tbs = tbsReward / ITreasuryToken(tbs).rate();
        } else {
            rewards.tbs = (_tbsLiquidity * rewardRate.tb) / MAX_RATE;
        }

        if ((_tbgLiquidity * rewardRate.tb) / MAX_RATE > tbgReward / ITreasuryToken(tbg).rate()) {
            rewards.tbg = tbgReward / ITreasuryToken(tbg).rate();
        } else {
            rewards.tbg = (_tbgLiquidity * rewardRate.tb) / MAX_RATE;
        }

        return rewards;
    }
}
