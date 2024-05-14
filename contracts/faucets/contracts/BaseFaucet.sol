// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * @title Base Faucet
 * @author LIRA DAO Team
 * @custom:security-contact contact@lira-dao.org
 */
contract BaseFaucet is Ownable {
    uint256 public tokenAmount = 10 ** 18;
    uint256 public waitTime = 1 days;

    ERC20 public token;

    event Withdraw(address account, uint256 amount);

    mapping(address => uint256) private lastAccessTime;

    constructor(address _token) Ownable(_msgSender()) {
        require(_token != address(0));
        token = ERC20(_token);
    }

    function withdraw() public {
        require(token.balanceOf(address(this)) >= tokenAmount, 'INSUFFICIENT_FUNDS');
        require(allowedToWithdraw(msg.sender), 'NOT_ALLOWED');
        token.transfer(msg.sender, tokenAmount);
        lastAccessTime[msg.sender] = block.timestamp + waitTime;

        emit Withdraw(msg.sender, tokenAmount);
    }

    function allowedToWithdraw(address _address) public view returns (bool) {
        if (lastAccessTime[_address] == 0) {
            return true;
        } else if (block.timestamp >= lastAccessTime[_address]) {
            return true;
        }
        return false;
    }

    function setTokenAmount(uint256 _tokenAmount) public onlyOwner {
        tokenAmount = _tokenAmount;
    }

    function setWaitTime(uint256 _waitTime) public onlyOwner {
        waitTime = _waitTime;
    }

    function empty() public onlyOwner {
        token.transfer(owner(), token.balanceOf(address(this)));
    }
}
