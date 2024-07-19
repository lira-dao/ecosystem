// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@lira-dao/treasury-tokens/contracts/interfaces/ITreasuryToken.sol';
import './interfaces/IStaker.sol';

/**
 * @title Token Staker V1
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract TokenStaker is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Staker {
        uint256 amount;
        uint256 lastRewardRound;
    }

    address public token;
    IERC20 public rewardToken1;
    IERC20 public rewardToken2;

    mapping(address => Staker) public stakers;

    uint256[2][] public rewardRounds;

    uint256 public totalStaked;

    address public boosterAddress;

    event Stake(address wallet, uint256 amount);
    event Unstake(address wallet, uint256 amount);
    event Harvest(address wallet, uint256 amountToken1, uint256 amountToken2);

    constructor(address _token, IERC20 _rewardToken1, IERC20 _rewardToken2) Ownable(msg.sender) {
        token = _token;
        rewardToken1 = _rewardToken1;
        rewardToken2 = _rewardToken2;
    }

    function stake(uint _amount) external nonReentrant {
        require(_amount > 0, 'INVALID_AMOUNT');

        Staker storage staker = stakers[msg.sender];

        require(staker.amount == 0 || staker.lastRewardRound == rewardRounds.length, 'PENDING_REWARDS');

        staker.amount += _amount;
        totalStaked += _amount;

        require(staker.amount >= 10 ** 18, 'MINIMUM_STAKE_AMOUNT');

        IERC20(token).safeTransferFrom(msg.sender, address(this), _amount);

        emit Stake(msg.sender, _amount);
    }

    function unstake(uint _amount) external nonReentrant {
        require(_amount > 0, 'INVALID_AMOUNT');

        Staker storage staker = stakers[msg.sender];

        require(staker.lastRewardRound == rewardRounds.length, 'PENDING_REWARDS');
        require(_amount <= staker.amount, 'INVALID_AMOUNT');

        (uint reward0, uint reward1) = IStaker(boosterAddress).pendingRewards(msg.sender);

        require(reward0 + reward1 == 0, 'PENDING_BOOST_REWARDS');

        require(IStaker(boosterAddress).stakers(msg.sender).amount <= (staker.amount - _amount) * (ITreasuryToken(token).rate() / 2), 'INVALID_BOOST_AMOUNT');

        staker.amount -= _amount;
        totalStaked -= _amount;

        IERC20(token).safeTransfer(msg.sender, _amount);

        emit Unstake(msg.sender, _amount);
    }

    function harvest() public nonReentrant {
        uint256 amount = stakers[msg.sender].amount;
        uint256 round = stakers[msg.sender].lastRewardRound;

        uint256 pendingReward1 = 0;
        uint256 pendingReward2 = 0;

        uint256 totalGas = gasleft();
        uint256 gasLimit = (totalGas * 10) / 100;

        while (round < rewardRounds.length && gasleft() > gasLimit) {
            pendingReward1 += (amount * rewardRounds[round][0]) / 1e36;
            pendingReward2 += (amount * rewardRounds[round][1]) / 1e36;

            round += 1;
        }

        stakers[msg.sender].lastRewardRound = round;

        if (pendingReward1 > 0) {
            rewardToken1.safeTransfer(msg.sender, pendingReward1);
        }

        if (pendingReward2 > 0) {
            rewardToken2.safeTransfer(msg.sender, pendingReward2);
        }

        emit Harvest(msg.sender, pendingReward1, pendingReward2);
    }

    function pendingRewards(address _address) public view returns (uint256, uint256) {
        Staker storage staker = stakers[_address];

        uint256 pendingReward1 = 0;
        uint256 pendingReward2 = 0;
        uint256 round = staker.lastRewardRound;

        while (round < rewardRounds.length) {
            pendingReward1 += (stakers[_address].amount * rewardRounds[round][0]) / 1e36;
            pendingReward2 += (stakers[_address].amount * rewardRounds[round][1]) / 1e36;

            round += 1;
        }

        return (pendingReward1, pendingReward2);
    }

    function distributeRewards(uint256 rewardAmount1, uint256 rewardAmount2) public onlyOwner nonReentrant {
        uint256 roundRewardPerShare1 = (rewardAmount1 * 1e36) / totalStaked;
        uint256 roundRewardPerShare2 = (rewardAmount2 * 1e36) / totalStaked;

        rewardRounds.push([roundRewardPerShare1, roundRewardPerShare2]);

        rewardToken1.safeTransferFrom(owner(), address(this), rewardAmount1);
        rewardToken2.safeTransferFrom(owner(), address(this), rewardAmount2);
    }

    function setBoosterAddress(address _boosterAddress) external onlyOwner {
        boosterAddress = _boosterAddress;
    }

    /**
     * Emergency function to recover tokens from the contract
     * @param tokenAddress ERC20 address, cannot be the staked token address
     */
    function emergencyWithdraw(IERC20 tokenAddress) public onlyOwner {
        require(tokenAddress != IERC20(token), 'CANNOT_WITHDRAW_LOCKED_TOKEN');
        require(tokenAddress != rewardToken1, 'CANNOT_WITHDRAW_LOCKED_TOKEN');
        require(tokenAddress != rewardToken2, 'CANNOT_WITHDRAW_LOCKED_TOKEN');

        IERC20(tokenAddress).safeTransfer(owner(), IERC20(tokenAddress).balanceOf(address(this)));
    }
}
