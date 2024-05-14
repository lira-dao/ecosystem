// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// @openzeppelin/contracts:5.0.2
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

interface IWETH9 {
    function deposit() external payable;

    function withdraw(uint256 _amount) external;
}

/**
 * @title Mock Wrapped Ethereum
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 */
contract MockWETH is ERC20('Wrapped Ether', 'WETH'), Ownable, IWETH9 {
    constructor() Ownable(_msgSender()) {}

    function deposit() external payable override {
        depositTo(msg.sender);
    }

    function withdraw(uint256 amount) external override {
        withdrawTo(msg.sender, amount);
    }

    function depositTo(address account) public payable {
        _mint(account, msg.value);
    }

    function withdrawTo(address account, uint256 amount) public {
        _burn(msg.sender, amount);
        (bool success,) = account.call{value: amount}("");
        require(success, "FAIL_TRANSFER");
    }

    function mint(uint256 amount) public onlyOwner {
        _mint(owner(), amount);
    }

    function burn(uint256 amount) public onlyOwner {
        _burn(owner(), amount);
    }

    receive() external payable {
        depositTo(msg.sender);
    }
}
