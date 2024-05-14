// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './TreasuryToken.sol';

/**
 * @title Treasury Bond Silver Token
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract TBs is TreasuryToken {
    constructor(address token_, uint rate_) TreasuryToken('Treasury Bond Silver', 'TBs', 18, token_, rate_) {}
}
