// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

/**
 * @title Referrals V1
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract Referrals is Ownable2Step {
    using SafeERC20 for IERC20;

    struct Reward {
        uint ldt;
        uint tbb;
        uint tbs;
        uint tbg;
    }

    address public token;

    uint public maxWithdraw = 1e20;
    uint public withdrawInterval = 1 weeks;

    mapping(address => address) public referrers; // user -> referrer
    mapping(address => Reward) public rewards; // referrer -> rewards
    mapping(address => uint256) public lastWithdraw;

    event ReferralRegistered(address indexed referrer, address indexed referee);
    event RewardClaimed(address indexed user, Reward amount);

    constructor(address _token) Ownable(msg.sender) {
        token = _token;
    }

    function setMaxWithdraw(uint _maxWithdraw) external onlyOwner {
        require(_maxWithdraw > 0, 'INVALID_VALUE');

        maxWithdraw = maxWithdraw;
    }

    function setWithdrawInterval(uint _withdrawInterval) external onlyOwner {
        require(_withdrawInterval > 0, 'INVALID_VALUE');
        withdrawInterval = _withdrawInterval;
    }

    function registerReferral(address referrer) public {
        require(referrer != msg.sender, 'INVALID_REFERRER');
        require(referrers[msg.sender] == address(0), 'ALREADY_REFERRED');

        referrers[msg.sender] = referrer;

        emit ReferralRegistered(referrer, msg.sender);
    }

    function claimReward() public {
        require(block.timestamp >= lastWithdraw[msg.sender] + withdrawInterval);

        Reward memory reward = rewards[msg.sender];
        require(reward.ldt + reward.tbb + reward.tbs + reward.tbg > 0, 'ZERO_REWARDS');

        rewards[msg.sender].ldt = 0;
        rewards[msg.sender].tbb = 0;
        rewards[msg.sender].tbs = 0;
        rewards[msg.sender].tbg = 0;

        // TODO: send rewards

        emit RewardClaimed(msg.sender, reward);
    }

    function deposit(Reward memory _rewards) external onlyOwner {
        // TODO: write rewards
    }

    function getRewards(address user) public view returns (Reward memory) {
        return rewards[user];
    }

    function getReferrer(address user) public view returns (address) {
        return referrers[user];
    }

    receive() external payable {
        revert('NOT_PAYABLE');
    }
}
