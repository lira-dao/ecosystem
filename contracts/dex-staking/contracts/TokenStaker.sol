// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

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

    IERC20 public token;
    IERC20 public rewardToken1;
    IERC20 public rewardToken2;

    mapping(address => Staker) public stakers;

    uint256[2][] public rewardRounds;

    uint256 public totalStaked;

    event Stake(address indexed account, uint amount);

    event Unstake(address indexed account, uint amount);

    event Harvest(address indexed account, uint amount);

    constructor(IERC20 _token, IERC20 _rewardToken1, IERC20 _rewardToken2) Ownable(msg.sender) {
        token = _token;
        rewardToken1 = _rewardToken1;
        rewardToken2 = _rewardToken2;
    }

    function stake(uint _amount) external nonReentrant {
        Staker storage staker = stakers[msg.sender];
        require(staker.amount == 0 || staker.lastRewardRound == rewardRounds.length, 'PENDING_REWARDS');

        staker.amount += _amount;
        staker.lastRewardRound = rewardRounds.length;

        totalStaked += _amount;

        token.safeTransferFrom(msg.sender, address(this), _amount);

        emit Stake(msg.sender, _amount);
    }

    function unstake(uint _amount) external nonReentrant {
        Staker storage staker = stakers[msg.sender];
        require(staker.lastRewardRound == rewardRounds.length, 'PENDING_REWARDS');

        staker.amount -= _amount;
        totalStaked -= _amount;

        token.safeTransfer(msg.sender, _amount);

        emit Unstake(msg.sender, _amount);
    }

    function harvest() external nonReentrant {}

    function pendingRewards(address _address) public view returns (uint) {
        return 0;
    }

    function distributeRewards(uint _amount) external onlyOwner nonReentrant {}

    /**
     * Emergency function to recover tokens from the contract
     * @param tokenAddress ERC20 address, cannot be the staked token address
     */
    function emergencyWithdraw(IERC20 tokenAddress) public onlyOwner {
        require(tokenAddress != token, 'CANNOT_WITHDRAW_LOCKED_TOKEN');

        IERC20(tokenAddress).safeTransfer(owner(), IERC20(tokenAddress).balanceOf(address(this)));
    }
}

/**
 * @title Token Staker Booster V1
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract TokenStakerBooster is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
}
