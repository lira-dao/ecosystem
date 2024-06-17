// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/IUniswapV2Pair.sol';


contract LPStakerV3 is Ownable {
    using SafeERC20 for IERC20;

    struct Staker {
        uint256 amount;
        uint256 lastRewardRound;
    }

    IUniswapV2Pair public lpToken;
    IERC20 public rewardToken1;
    IERC20 public rewardToken2;

    mapping(address => Staker) public stakers;

    uint256[2][] public rewardRounds;

    uint256 public totalStaked;

    constructor(IUniswapV2Pair _lpToken, IERC20 _rewardToken1, IERC20 _rewardToken2) Ownable(msg.sender) {
        lpToken = _lpToken;
        rewardToken1 = _rewardToken1;
        rewardToken2 = _rewardToken2;
    }

    function stake(uint256 _amount) public {
        Staker storage staker = stakers[msg.sender];
        require(staker.amount == 0 || staker.lastRewardRound == rewardRounds.length, 'PENDING_REWARDS');

        lpToken.transferFrom(msg.sender, address(this), _amount);
        staker.amount += _amount;
        staker.lastRewardRound = rewardRounds.length;

        totalStaked += _amount;
    }

    function unstake(uint256 _amount) public {
        Staker storage staker = stakers[msg.sender];
        require(staker.lastRewardRound == rewardRounds.length, 'PENDING_REWARDS');

        staker.amount -= _amount;

        lpToken.transfer(msg.sender, _amount);
        totalStaked -= _amount;
    }

    function harvest() public {
        Staker storage staker = stakers[msg.sender];

        uint256 pendingReward1 = 0;
        uint256 pendingReward2 = 0;
        uint256 totalGas = gasleft();
        uint256 gasLimit = (totalGas * 10) / 100;
        uint256 round = staker.lastRewardRound;

        while (round < rewardRounds.length && gasleft() > gasLimit) {
            pendingReward1 += (stakers[msg.sender].amount * rewardRounds[round][0]) / 1e36;
            pendingReward2 += (stakers[msg.sender].amount * rewardRounds[round][1]) / 1e36;

            round += 1;
        }

        if (pendingReward1 > 0) {
            rewardToken1.safeTransfer(msg.sender, pendingReward1);
        }

        if (pendingReward2 > 0) {
            rewardToken2.safeTransfer(msg.sender, pendingReward2);
        }

        staker.lastRewardRound = round;
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

    function distributeRewards(uint256 rewardAmount1, uint256 rewardAmount2) public onlyOwner {
        uint256 roundRewardPerShare1 = (rewardAmount1 * 1e36) / totalStaked;
        uint256 roundRewardPerShare2 = (rewardAmount2 * 1e36) / totalStaked;

        rewardRounds.push([roundRewardPerShare1, roundRewardPerShare2]);

        rewardToken1.safeTransferFrom(msg.sender, address(this), rewardAmount1);
        rewardToken2.safeTransferFrom(msg.sender, address(this), rewardAmount2);
    }

    // TEST FUNCTION: MUST BE REMOVED IN FINAL IMPLEMENTATION
    function empty() public onlyOwner {
        lpToken.transfer(msg.sender, lpToken.balanceOf(address(this)));
        rewardToken1.transfer(msg.sender, rewardToken1.balanceOf(address(this)));
        rewardToken2.transfer(msg.sender, rewardToken2.balanceOf(address(this)));
    }
}

contract LPStakerV4 is Ownable {
    using SafeERC20 for IERC20;

    struct Staker {
        uint256 amount;
        uint256 lastRewardRound;
    }

    IUniswapV2Pair public lpToken;
    IERC20 public rewardToken1;
    IERC20 public rewardToken2;

    mapping(address => Staker) public stakers;

    uint256[2][] public rewardRounds;

    uint256 public totalStaked;

    constructor(IUniswapV2Pair _lpToken, IERC20 _rewardToken1, IERC20 _rewardToken2) Ownable(msg.sender) {
        lpToken = _lpToken;
        rewardToken1 = _rewardToken1;
        rewardToken2 = _rewardToken2;
    }

    function stake(uint256 _amount) public {
        Staker storage staker = stakers[msg.sender];
        require(staker.amount == 0 || staker.lastRewardRound == rewardRounds.length, 'PENDING_REWARDS');

        lpToken.transferFrom(msg.sender, address(this), _amount);
        staker.amount += _amount;
        staker.lastRewardRound = rewardRounds.length;

        totalStaked += _amount;
    }

    function unstake(uint256 _amount) public {
        Staker storage staker = stakers[msg.sender];
        require(staker.lastRewardRound == rewardRounds.length, 'PENDING_REWARDS');

        staker.amount -= _amount;

        lpToken.transfer(msg.sender, _amount);
        totalStaked -= _amount;
    }

    function harvest() public {
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

        if (pendingReward1 > 0) {
            rewardToken1.safeTransfer(msg.sender, pendingReward1);
        }

        if (pendingReward2 > 0) {
            rewardToken2.safeTransfer(msg.sender, pendingReward2);
        }

        stakers[msg.sender].lastRewardRound = round;
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

    function distributeRewards(uint256 rewardAmount1, uint256 rewardAmount2) public onlyOwner {
        uint256 roundRewardPerShare1 = (rewardAmount1 * 1e36) / totalStaked;
        uint256 roundRewardPerShare2 = (rewardAmount2 * 1e36) / totalStaked;

        rewardRounds.push([roundRewardPerShare1, roundRewardPerShare2]);

        rewardToken1.safeTransferFrom(msg.sender, address(this), rewardAmount1);
        rewardToken2.safeTransferFrom(msg.sender, address(this), rewardAmount2);
    }

    // TEST FUNCTION: MUST BE REMOVED IN FINAL IMPLEMENTATION
    function empty() public onlyOwner {
        lpToken.transfer(msg.sender, lpToken.balanceOf(address(this)));
        rewardToken1.transfer(msg.sender, rewardToken1.balanceOf(address(this)));
        rewardToken2.transfer(msg.sender, rewardToken2.balanceOf(address(this)));
    }
}