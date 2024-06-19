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

    IERC20 public token;

    event Stake(address indexed account, uint amount);

    event Unstake(address indexed account, uint amount);

    event Harvest(address indexed account, uint amount);

    constructor(IERC20 _token) Ownable(msg.sender) {
        token = _token;
    }

    function stake(uint _amount) external nonReentrant {}

    function unstake(uint _amount) external nonReentrant {}

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
