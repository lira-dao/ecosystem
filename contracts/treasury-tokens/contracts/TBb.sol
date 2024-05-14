// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './TreasuryToken.sol';

/**
 * @title Treasury Bond Bronze Token
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract TBb is TreasuryToken {
    constructor(address token_, uint rate_) TreasuryToken('Treasury Bond Bronze', 'TBb', 18, token_, rate_) {}
}
