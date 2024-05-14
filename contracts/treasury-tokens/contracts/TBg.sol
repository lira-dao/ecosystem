// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './TreasuryToken.sol';

/**
 * @title Treasury Bond Gold Token
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract TBg is TreasuryToken {
    constructor(address token_, uint rate_) TreasuryToken('Treasury Bond Gold', 'TBg', 18, token_, rate_) {}
}
