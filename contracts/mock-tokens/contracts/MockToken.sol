// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// @openzeppelin/contracts:5.0.2
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * @title Mock Token
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 */
contract MockToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol) Ownable(_msgSender()) ERC20(name, symbol) {}

    function decimals() public pure override returns (uint8) {
        return 18;
    }

    function mint(address to, uint256 quantity) public {
        _mint(to, quantity);
    }

    function burn(uint256 quantity) public {
        _burn(_msgSender(), quantity);
    }
}
