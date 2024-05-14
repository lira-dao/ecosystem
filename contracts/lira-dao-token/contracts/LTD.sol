// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// contracts from OpenZeppelin Contracts (last updated v5.0.2)
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * @title LIRA Dao Token
 * @author Satoshi LIRA Team
 * @custom:security-contact contact@satoshilira.io
 */
contract LDT is ERC20('LIRA Dao Token', 'LDT'), Ownable {
    using SafeERC20 for ERC20;

    constructor(address vault, address team, address marketing, address liquidity, address presale) Ownable(_msgSender()) {
        _mint(vault, 9_000_000_000 * 10 ** 18);
        _mint(team, 50_000_000 * 10 ** 18);
        _mint(marketing, 100_000_000 * 10 ** 18);
        _mint(liquidity, 100_000_000 * 10 ** 18);
        _mint(presale, 750_000_000 * 10 ** 18);
    }

    function burn(uint256 quantity) public {
        _burn(_msgSender(), quantity);
    }
}
