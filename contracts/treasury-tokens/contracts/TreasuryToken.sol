// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// contracts from OpenZeppelin Contracts (last updated v5.0.2)
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Address.sol';

/**
 * @title Treasury Token
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 */
contract TreasuryToken is Ownable, ERC20 {
    using Address for address;
    using SafeERC20 for ERC20;

    uint8 private _decimals;

    address public token;

    address public feeVault;

    uint public rate;

    bool public isMintEnabled = false;

    uint256 public mintFee = 10;
    uint256 public mintFeeDao = 0;

    uint256 public burnFee = 10;
    uint256 public burnFeeDao = 0;

    uint256 public feeAmount = 0;

    modifier onlyOwnerOrIfEnabled() {
        require(msg.sender == owner() || isMintEnabled, 'MINT_DISABLED');
        _;
    }

    constructor (
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        address token_,
        uint rate_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        _decimals = decimals_;
        token = token_;
        rate = rate_;
        feeVault = msg.sender;
    }

    /**
     * Override ERC20 decimals
     */
    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /**
     * Mint a treasury tokens locking the associated token
     * @param to the address who receive the treasury tokens
     * @param amount amount of associated token to lock
     */
    function mint(address to, uint256 amount) public onlyOwnerOrIfEnabled {
        require(msg.sender == owner() || amount >= 10 ** decimals(), 'MINIMUM_MINT_AMOUNT');

        uint256 cost = amount * rate;
        uint256 fee = 0;

        if (msg.sender == owner()) {
            fee = (cost / 100) * mintFeeDao;
        } else {
            fee = (cost / 100) * mintFee;
        }

        ERC20(token).safeTransferFrom(msg.sender, address(this), cost + fee);

        feeAmount = feeAmount + fee;

        _mint(to, amount);
    }

    function quoteMint(uint256 amount) public view returns (uint256 total, uint256 cost, uint256 fee) {
        require(msg.sender == owner() || amount >= 10 ** decimals(), 'MINIMUM_MINT_AMOUNT');

        cost = amount * rate;

        if (msg.sender == owner()) {
            fee = (cost / 100) * mintFeeDao;
        } else {
            fee = (cost / 100) * mintFee;
        }

        total = cost + fee;
    }

    /**
     * Burn the treasury token and return back locked token
     *
     * @param amount of treasury tokens to burn
     */
    function burn(uint256 amount) public {
        require(msg.sender == owner() || amount >= 10 ** decimals(), 'MINIMUM_BURN_AMOUNT');

        uint256 locked = amount * rate;
        uint256 fee = 0;

        if (msg.sender == owner()) {
            fee = (locked / 100) * burnFeeDao;
        } else {
            fee = (locked / 100) * burnFee;
        }

        uint256 unlock = locked - fee;

        _burn(msg.sender, amount);

        ERC20(token).safeTransfer(msg.sender, unlock);

        feeAmount = feeAmount + fee;
    }

    function quoteBurn(uint256 amount) public view returns (uint256 unlock, uint fee) {
        require(msg.sender == owner() || amount >= 10 ** decimals(), 'MINIMUM_BURN_AMOUNT');

        uint256 locked = amount * rate;

        if (msg.sender == owner()) {
            fee = (locked / 100) * burnFeeDao;
        } else {
            fee = (locked / 100) * burnFee;
        }

        unlock = locked - fee;
    }

    function setMintFee(uint256 newMintFee) public onlyOwner {
        require(newMintFee >= 1 && newMintFee < 100, 'INVALID_MINT_FEE');

        mintFee = newMintFee;
    }

    function setMintFeeDao(uint256 newMintFeeDao) public onlyOwner {
        require(newMintFeeDao >= 0 && newMintFeeDao < 100, 'INVALID_MINT_FEE');

        mintFeeDao = newMintFeeDao;
    }

    function setBurnFee(uint256 newBurnFee) public onlyOwner {
        require(newBurnFee >= 1 && newBurnFee < 100, 'INVALID_BURN_FEE');

        burnFee = newBurnFee;
    }

    function setBurnFeeDao(uint256 newBurnFeeDao) public onlyOwner {
        require(newBurnFeeDao >= 1 && newBurnFeeDao < 100, 'INVALID_BURN_FEE');

        burnFeeDao = newBurnFeeDao;
    }

    function setIsMintEnabled(bool mintEnabled) public onlyOwner {
        isMintEnabled = mintEnabled;
    }

    function setFeeVault(address newFeeVault) public onlyOwner {
        feeVault = newFeeVault;
    }

    function collectFees() public onlyOwner {
        ERC20(token).safeTransfer(feeVault, feeAmount);
        feeAmount = 0;
    }

    /**
     * Emergency function to recover tokens from the contract
     * @param tokenAddress ERC20 address, cannot be the locked token address
     */
    function emergencyWithdraw(address tokenAddress) public onlyOwner {
        require(tokenAddress != token, 'CANNOT_WITHDRAW_LOCKED_TOKEN');

        ERC20(tokenAddress).safeTransfer(owner(), ERC20(tokenAddress).balanceOf(address(this)));
    }
}
