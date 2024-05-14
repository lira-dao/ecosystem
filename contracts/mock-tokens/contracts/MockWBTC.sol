// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// @openzeppelin/contracts:5.0.2
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * @title Mock Wrapped Bitcoin
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 */
contract MockWBTC is ERC20('Wrapped BTC', 'WBTC'), Ownable {
    constructor() Ownable(_msgSender()) {}

    function decimals() public pure override returns (uint8) {
        return 8;
    }

    function mint(address to, uint256 quantity) public {
        _mint(to, quantity);
    }

    function burn(uint256 quantity) public {
        _burn(_msgSender(), quantity);
    }
}
