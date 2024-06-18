// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable2Step.sol';


/**
 * @title Token Distributor
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract TokenDistributor is Ownable2Step {
    struct Distribution {
        // amount to emit
        uint amount;

        // emitted amount
        uint emitted;

        // seconds between emits
        uint rate;

        // time between distributions
        uint cadence;
    }

    // token to distribute
    IERC20 public token;

    address public splitter;

    // distribution list
    Distribution[] public distributions;

    // balance after a distribution
    uint public lastBalance;

    // current distribution
    uint public currentDistribution = 0;

    // next distribution timestamp
    uint public nextDistribution = 0;

    modifier onlySplitter() {
        msg.sender == splitter;
        _;
    }

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
        splitter = msg.sender;
    }

    function deposit(Distribution[] memory _distributions) public onlyOwner {
        require(distributions.length == 0, 'ALREADY_STARTED');

        uint supply = 0;

        for (uint i = 0; i < _distributions.length; i++) {
            supply = supply + _distributions[i].amount;
            distributions.push(_distributions[i]);
        }

        token.transferFrom(msg.sender, address(this), supply);

        nextDistribution = block.timestamp;
    }

    function distribute() public onlySplitter {
        require(block.timestamp > nextDistribution, 'CADENCE');

        uint tokenBalance = token.balanceOf(address(this));

        // not distributed
        if (distributions[currentDistribution].emitted > 0) {
            uint notDistributed = token.balanceOf(address(this)) - lastBalance;
            distributions[currentDistribution].emitted = distributions[currentDistribution].emitted - notDistributed;
        }

        uint distributionAmount = distributions[currentDistribution].rate;

        // send distribution
        if (tokenBalance < distributions[currentDistribution].rate) {
            distributionAmount = token.balanceOf(address(this));
        } else {
            distributionAmount = distributions[currentDistribution].rate;
        }

        require(distributionAmount > 0, 'DISTRIBUTED');

        token.transfer(splitter, distributionAmount);

        // update emitted amount
        distributions[currentDistribution].emitted = distributions[currentDistribution].emitted + distributionAmount;

        // update last balance
        lastBalance = token.balanceOf(address(this));

        if (currentDistribution < distributions.length - 1 && distributions[currentDistribution].emitted >= distributions[currentDistribution].amount) {
            currentDistribution = currentDistribution + 1;
        }

        // update last distributed
        nextDistribution += distributions[currentDistribution].cadence;
    }

    function setSplitter(address _splitter) public onlyOwner {
        splitter = _splitter;
    }

    // TEST FUNCTION: MUST BE REMOVED IN FINAL IMPLEMENTATION
    function empty() public onlyOwner {
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }
}
