// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// contracts from OpenZeppelin Contracts (last updated v4.8.0)
import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title LIRA Dao Presale
 * @author Satoshi LIRA Team
 * @custom:security-contact contact@satoshilira.io
 */
contract LiraDaoPresale is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 public immutable token;

    event Sell(address to_, uint input_, uint amount_, uint bonus_);

    struct Round {
        uint start;
        uint end;
        uint bonus;
        uint number;
    }

    Round[] public _rounds;

    modifier isNotEnded {
        // no rounds no party
        require(_rounds.length > 0, 'LDT_PRESALE_NOT_STARTED');
        require(block.timestamp <= _rounds[_rounds.length - 1].end, 'LDT_PRESALE_ENDED');
        _;
    }

    modifier isNotStarted {
        require(_rounds.length == 0, 'LDT_PRESALE_NOT_STARTED');
        _;
    }

    modifier isEnded {
        require(_rounds.length > 0, 'LDT_PRESALE_NOT_STARTED');
        require(block.timestamp > _rounds[_rounds.length - 1].end, 'LDT_PRESALE_NOT_ENDED');
        _;
    }

    constructor(address _token) {
        token = IERC20(_token);
    }

    function buy() public payable isNotEnded {
        require(msg.value >= 10 ** 12, "LDT_PRESALE_MIN_BUY");

        uint amount = (msg.value.div(4)).mul(10 ** 6);
        uint bonus = amount.div(100).mul(round().bonus);

        require(token.balanceOf(address(this)) >= amount.add(bonus), "LDT_PRESALE_INSUFFICIENT_SUPPLY");

        token.safeTransfer(_msgSender(), amount.add(bonus));
        emit Sell(_msgSender(), msg.value, amount, bonus);
    }

    function quoteBuy(uint amount_) public view returns (uint) {
        require(amount_ >= 10 ** 12, "LDT_PRESALE_MIN_BUY");

        uint amount = (amount_.div(4)).mul(10 ** 6);
        uint bonus = amount.div(100).mul(round().bonus);

        return amount.add(bonus);
    }

    function withdraw() public payable onlyOwner {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, bytes memory data) = owner().call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function withdrawToken() public onlyOwner isEnded {
        token.safeTransfer(owner(), token.balanceOf(address(this)));
    }

    // returns true if the presale is started
    function started() public view returns (bool started_) {
        started_ = _rounds.length > 0 && block.timestamp <= _rounds[_rounds.length - 1].end;
    }

    // starts the ritual
    function start(uint[] memory bonuses_, uint duration_) public onlyOwner isNotStarted {
        for (uint i = 0; i < bonuses_.length; i++) {
            uint startTime = block.timestamp + (i * duration_);
            uint endTime = block.timestamp + ((1 + i) * duration_) - 1;

            _rounds.push(Round(startTime, endTime, bonuses_[i], i + 1));
        }
    }

    // current round
    function round() public view isNotEnded returns (Round memory round_) {
        for (uint i = 0; i < _rounds.length; i++) {
            if (block.timestamp >= _rounds[i].start && block.timestamp <= _rounds[i].end) {
                return _rounds[i];
            }
        }
    }
}
