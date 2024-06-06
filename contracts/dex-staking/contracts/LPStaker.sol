// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/access/Ownable2Step.sol';

interface IUniswapV2Pair {
    function transferFrom(address from, address to, uint value) external returns (bool);

    function transfer(address to, uint value) external returns (bool);

    function balanceOf(address owner) external view returns (uint);
}

contract LPStaker is Ownable2Step {
    using SafeERC20 for IERC20;

    IUniswapV2Pair public lpToken;
    IERC20 public rewardToken1;
    IERC20 public rewardToken2;

    struct Staker {
        uint256 amount;
        uint256 rewardDebt1;
        uint256 rewardDebt2;
        uint256 pendingReward1;
        uint256 pendingReward2;
    }

    mapping(address => Staker) public stakers;
    address[] public stakerAddresses;
    uint256 public totalStaked;

    uint256 public accRewardPerShare1;
    uint256 public accRewardPerShare2;

    uint256 public lastRewardBlock;

    uint256 public previousReward1;
    uint256 public previousReward2;

    event Stake(address indexed user, uint256 amount);
    event Unstake(address indexed user, uint256 amount);
    event Harvest(address indexed user, uint256 reward1, uint256 reward2);

    constructor(IUniswapV2Pair _lpToken, IERC20 _rewardToken1, IERC20 _rewardToken2) Ownable(msg.sender) {
        lpToken = _lpToken;
        rewardToken1 = _rewardToken1;
        rewardToken2 = _rewardToken2;
        lastRewardBlock = block.number;
        previousReward1 = 0;
        previousReward2 = 0;
    }

    function updatePool() internal {
        if (block.number <= lastRewardBlock) {
            return;
        }

        if (totalStaked == 0) {
            lastRewardBlock = block.number;
            return;
        }

        uint256 currentReward1 = rewardToken1.balanceOf(address(this));
        uint256 currentReward2 = rewardToken2.balanceOf(address(this));

        uint256 reward1 = currentReward1 >= previousReward1 ? currentReward1 - previousReward1 : 0;
        uint256 reward2 = currentReward2 >= previousReward2 ? currentReward2 - previousReward2 : 0;

        if (reward1 > 0) {
            accRewardPerShare1 += (reward1 * 1e12) / totalStaked;
        }

        if (reward2 > 0) {
            accRewardPerShare2 += (reward2 * 1e12) / totalStaked;
        }

        // Accumulate rewards for all stakers
        for (uint256 i = 0; i < stakerAddresses.length; i++) {
            address stakerAddress = stakerAddresses[i];
            Staker storage staker = stakers[stakerAddress];

            uint256 pendingReward1 = (staker.amount * accRewardPerShare1) / 1e12 - staker.rewardDebt1;
            uint256 pendingReward2 = (staker.amount * accRewardPerShare2) / 1e12 - staker.rewardDebt2;

            if (pendingReward1 > 0) {
                staker.pendingReward1 += pendingReward1;
            }
            if (pendingReward2 > 0) {
                staker.pendingReward2 += pendingReward2;
            }

            staker.rewardDebt1 = (staker.amount * accRewardPerShare1) / 1e12;
            staker.rewardDebt2 = (staker.amount * accRewardPerShare2) / 1e12;
        }

        previousReward1 = currentReward1;
        previousReward2 = currentReward2;
        lastRewardBlock = block.number;
    }

    function pendingRewards(address _user) public view returns (uint256 pendingReward1, uint256 pendingReward2) {
        Staker storage staker = stakers[_user];
        uint256 tempAccRewardPerShare1 = accRewardPerShare1;
        uint256 tempAccRewardPerShare2 = accRewardPerShare2;

        if (block.number > lastRewardBlock && totalStaked != 0) {
            uint256 reward1 = rewardToken1.balanceOf(address(this)) >= previousReward1 ? rewardToken1.balanceOf(address(this)) - previousReward1 : 0;
            uint256 reward2 = rewardToken2.balanceOf(address(this)) >= previousReward2 ? rewardToken2.balanceOf(address(this)) - previousReward2 : 0;

            if (reward1 > 0) {
                tempAccRewardPerShare1 += (reward1 * 1e12) / totalStaked;
            }

            if (reward2 > 0) {
                tempAccRewardPerShare2 += (reward2 * 1e12) / totalStaked;
            }
        }

        pendingReward1 = (staker.amount * tempAccRewardPerShare1) / 1e12 - staker.rewardDebt1 + staker.pendingReward1;
        pendingReward2 = (staker.amount * tempAccRewardPerShare2) / 1e12 - staker.rewardDebt2 + staker.pendingReward2;
    }

    function stake(uint256 _amount) public {
        updatePool();
        Staker storage staker = stakers[msg.sender];

        if (staker.amount == 0) {
            stakerAddresses.push(msg.sender);
        }

        if (staker.amount > 0) {
            (uint256 pendingReward1, uint256 pendingReward2) = pendingRewards(msg.sender);

            if (pendingReward1 > 0) {
                staker.pendingReward1 = pendingReward1;
            }
            if (pendingReward2 > 0) {
                staker.pendingReward2 = pendingReward2;
            }
        }

        lpToken.transferFrom(msg.sender, address(this), _amount);
        staker.amount += _amount;
        staker.rewardDebt1 = (staker.amount * accRewardPerShare1) / 1e12;
        staker.rewardDebt2 = (staker.amount * accRewardPerShare2) / 1e12;

        totalStaked += _amount;
        emit Stake(msg.sender, _amount);
    }

    function unstake(uint256 _amount) public {
        Staker storage staker = stakers[msg.sender];
        require(staker.amount >= _amount, "Insufficient staked amount");

        updatePool();

        (uint256 pendingReward1, uint256 pendingReward2) = pendingRewards(msg.sender);

        if (pendingReward1 > 0) {
            staker.pendingReward1 = pendingReward1;
        }
        if (pendingReward2 > 0) {
            staker.pendingReward2 = pendingReward2;
        }

        staker.amount -= _amount;
        staker.rewardDebt1 = (staker.amount * accRewardPerShare1) / 1e12;
        staker.rewardDebt2 = (staker.amount * accRewardPerShare2) / 1e12;

        lpToken.transfer(msg.sender, _amount);
        totalStaked -= _amount;
        emit Unstake(msg.sender, _amount);
    }

    function harvest() public {
        Staker storage staker = stakers[msg.sender];
        updatePool();

        (uint256 pendingReward1, uint256 pendingReward2) = pendingRewards(msg.sender);

        if (pendingReward1 > 0) {
            rewardToken1.safeTransfer(msg.sender, pendingReward1);
            staker.pendingReward1 = 0;
        }

        if (pendingReward2 > 0) {
            rewardToken2.safeTransfer(msg.sender, pendingReward2);
            staker.pendingReward2 = 0;
        }

        staker.rewardDebt1 = (staker.amount * accRewardPerShare1) / 1e12;
        staker.rewardDebt2 = (staker.amount * accRewardPerShare2) / 1e12;

        emit Harvest(msg.sender, pendingReward1, pendingReward2);
    }

    function emergencyWithdraw() public {
        Staker storage staker = stakers[msg.sender];
        lpToken.transfer(msg.sender, staker.amount);

        totalStaked -= staker.amount;
        staker.amount = 0;
        staker.rewardDebt1 = 0;
        staker.rewardDebt2 = 0;
        staker.pendingReward1 = 0;
        staker.pendingReward2 = 0;
    }

    function distributeRewards(uint256 rewardAmount1, uint256 rewardAmount2) public onlyOwner {

        for (uint256 i = 0; i < stakerAddresses.length; i++) {
            address stakerAddress = stakerAddresses[i];
            Staker storage staker = stakers[stakerAddress];

            uint256 pendingReward1 = (staker.amount * rewardAmount1) / 1e12 - staker.rewardDebt1;
            uint256 pendingReward2 = (staker.amount * rewardAmount2) / 1e12 - staker.rewardDebt2;

            if (pendingReward1 > 0) {
                staker.pendingReward1 += pendingReward1;
            }
            if (pendingReward2 > 0) {
                staker.pendingReward2 += pendingReward2;
            }

            staker.rewardDebt1 = (staker.amount * accRewardPerShare1) / 1e12;
            staker.rewardDebt2 = (staker.amount * accRewardPerShare2) / 1e12;
        }

        rewardToken1.safeTransferFrom(msg.sender, address(this), rewardAmount1);
        rewardToken2.safeTransferFrom(msg.sender, address(this), rewardAmount2);
        updatePool();
    }

    // TEST FUNCTION: MUST BE REMOVED IN FINAL IMPLEMENTATION
    function empty() public onlyOwner {
        lpToken.transfer(msg.sender, lpToken.balanceOf(address(this)));
        rewardToken1.transfer(msg.sender, rewardToken1.balanceOf(address(this)));
        rewardToken2.transfer(msg.sender, rewardToken2.balanceOf(address(this)));
    }
}

/*contract LPStakerV2 is Ownable2Step {
    IUniswapV2Pair public lpToken;
    IERC20 public rewardToken1;
    IERC20 public rewardToken2;

    struct Staker {
        uint256 amount;
        uint256 pendingReward1;
        uint256 pendingReward2;
    }

    mapping(address => Staker) public stakers;
    address[] public stakerAddresses;
    uint256 public totalStaked;

    constructor(IUniswapV2Pair _lpToken, IERC20 _rewardToken1, IERC20 _rewardToken2) Ownable(msg.sender) {
        lpToken = _lpToken;
        rewardToken1 = _rewardToken1;
        rewardToken2 = _rewardToken2;
    }

    function stake(uint256 _amount) public {
        Staker storage staker = stakers[msg.sender];

        if (!stakerAddresses[msg.sender] == address(0)) {
            stakerAddresses.push(msg.sender);
        }

        //lpToken.transferFrom(msg.sender, address(this), _amount);
        //staker.amount += _amount;
    }
}*/