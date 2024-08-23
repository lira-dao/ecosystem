// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

/**
 * @title ReferralsRewards V1
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract ReferralsRewards is Ownable2Step {
    using SafeERC20 for IERC20;

    struct Reward {
        uint ldt;
        uint tbb;
        uint tbs;
        uint tbg;
    }

    struct RewardItem {
        address wallet;
        uint ldt;
        uint tbb;
        uint tbs;
        uint tbg;
    }

    address public ldt;
    address public tbb;
    address public tbs;
    address public tbg;

    uint public maxWithdraw = 1e20;
    uint public withdrawInterval = 1 weeks;

    mapping(address => Reward) public rewards;
    mapping(address => uint256) public lastWithdraw;

    event DistributeRewards(uint ldt, uint tbb, uint tbs, uint tbg);
    event Harvest(address indexed wallet, Reward amount);

    constructor(address _ldt, address _tbb, address _tbs, address _tbg) Ownable(msg.sender) {
        ldt = _ldt;
        tbb = _tbb;
        tbs = _tbs;
        tbg = _tbg;
    }

    function setMaxWithdraw(uint _maxWithdraw) external onlyOwner {
        require(_maxWithdraw > 0, 'INVALID_VALUE');

        maxWithdraw = maxWithdraw;
    }

    function setWithdrawInterval(uint _withdrawInterval) external onlyOwner {
        require(_withdrawInterval > 0, 'INVALID_VALUE');
        withdrawInterval = _withdrawInterval;
    }

    function harvest() public {
        require(block.timestamp >= lastWithdraw[msg.sender] + withdrawInterval, 'TIME_LOCK');

        // TODO: MAX WITHDRAW

        Reward memory reward = rewards[msg.sender];
        require(reward.ldt + reward.tbb + reward.tbs + reward.tbg > 0, 'ZERO_REWARDS');

        if (reward.ldt > 0) {
            IERC20(ldt).safeTransfer(msg.sender, reward.ldt);
        }

        if (reward.tbb > 0) {
            IERC20(tbb).safeTransfer(msg.sender, reward.tbb);
        }

        if (reward.tbs > 0) {
            IERC20(tbs).safeTransfer(msg.sender, reward.tbs);
        }

        if (reward.tbg > 0) {
            IERC20(tbg).safeTransfer(msg.sender, reward.tbg);
        }

        rewards[msg.sender].ldt = 0;
        rewards[msg.sender].tbb = 0;
        rewards[msg.sender].tbs = 0;
        rewards[msg.sender].tbg = 0;

        lastWithdraw[msg.sender] = block.timestamp;

        emit Harvest(msg.sender, reward);
    }

    function distributeRewards(RewardItem[] memory _rewards) external onlyOwner {
        uint totalLdt = 0;
        uint totalTbb = 0;
        uint totalTbs = 0;
        uint totalTbg = 0;

        for (uint i = 0; i < _rewards.length; i++) {
            require(_rewards[i].wallet != address(0), 'INVALID_ADDRESS');

            totalLdt += _rewards[i].ldt;
            totalTbb += _rewards[i].tbb;
            totalTbs += _rewards[i].tbs;
            totalTbg += _rewards[i].tbg;

            rewards[_rewards[i].wallet].ldt += _rewards[i].ldt;
            rewards[_rewards[i].wallet].tbb += _rewards[i].tbb;
            rewards[_rewards[i].wallet].tbs += _rewards[i].tbs;
            rewards[_rewards[i].wallet].tbg += _rewards[i].tbg;
        }

        emit DistributeRewards(totalLdt, totalTbb, totalTbs, totalTbg);
    }

    receive() external payable {
        revert('NOT_PAYABLE');
    }
}
