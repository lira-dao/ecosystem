// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './TreasuryToken.sol';

/**
 * @title LIRA Treasury Bond Silver Token
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract LTBs is TreasuryToken {
    constructor(address token_, uint rate_) TreasuryToken('LIRA Treasury Bond Silver', 'LTBs', 8, token_, rate_) {}
}
