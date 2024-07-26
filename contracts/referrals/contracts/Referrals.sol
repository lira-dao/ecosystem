// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable2Step.sol';

/**
 * @title Referrals V1
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract Referrals is Ownable2Step {
    mapping(address => address) public referrers;

    event ReferralRegistered(address indexed referrer, address indexed referee);

    constructor() Ownable(msg.sender) {}

    function register(address referrer) external {
        require(referrer != msg.sender, 'INVALID_REFERRER');
        require(referrers[msg.sender] == address(0), 'ALREADY_REFERRED');

        referrers[msg.sender] = referrer;

        emit ReferralRegistered(referrer, msg.sender);
    }

    function referred(address _referee) external view returns (bool) {
        return referrers[_referee] != address(0);
    }

    receive() external payable {
        revert('NOT_PAYABLE');
    }
}
