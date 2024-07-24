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

    address public token;

    uint public maxWithdraw = 1e18;
    uint public withdrawInterval = 1 weeks;

    mapping(address => address) public referrerOf; // user -> referrer
    mapping(address => uint256) public rewards; // referrer -> rewards
    mapping(address => uint256) public lastWithdraw;

    event ReferralRegistered(address indexed referrer, address indexed referee);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(address _token) {
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
        require(referrerOf[msg.sender] == address(0), 'ALREADY_REFERRED');

        referrerOf[msg.sender] = referrer;

        emit ReferralRegistered(referrer, msg.sender);
    }

    function claimReward() public {
        require(block.timestamp >= lastWithdraw[msg.sender] + withdrawInterval);

        uint256 reward = rewards[msg.sender];
        require(reward > 0, 'ZERO_REWARDS');

        rewards[msg.sender] = 0;

        // TODO: send rewards

        emit RewardClaimed(msg.sender, reward);
    }

    function deposit() public payable onlyOwner {
        // TODO: write rewards
    }

    function getRewards(address user) public view returns (uint256) {
        return rewards[user];
    }

    function getReferrer(address user) public view returns (address) {
        return referrerOf[user];
    }

    receive() external payable {
        revert('NOT_PAYABLE');
    }
}
