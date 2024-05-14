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

    uint256 public burnFee = 10;

    uint256 public feeAmount = 0;

    modifier onlyOwnerOrIfEnabled() {
        require(_msgSender() == owner() || isMintEnabled, 'MINT_DISABLED');
        _;
    }

    constructor (
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        address token_,
        uint rate_
    ) ERC20(name_, symbol_) Ownable(_msgSender()) {
        _decimals = decimals_;
        token = token_;
        rate = rate_;
        feeVault = _msgSender();
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
        require(amount >= 10 ** decimals(), 'MINIMUM_MINT_AMOUNT');

        uint256 cost = amount * rate;
        uint256 fee = (cost / 100) * mintFee;

        ERC20(token).safeTransferFrom(_msgSender(), address(this), cost + fee);

        feeAmount = feeAmount + fee;

        _mint(to, amount);
    }

    function quoteMint(uint256 amount) public view returns (uint256 total, uint256 cost, uint256 fee) {
        require(amount >= 10 ** decimals(), 'MINIMUM_MINT_AMOUNT');

        cost = amount * rate;
        fee = (cost / 100) * mintFee;
        total = cost + fee;
    }

    /**
     * Burn the treasury token and return back locked token
     *
     * @param amount of treasury tokens to burn
     */
    function burn(uint256 amount) public {
        require(amount >= 10 ** decimals(), 'MINIMUM_BURN_AMOUNT');

        uint256 locked = amount * rate;
        uint256 fee = (locked / 100) * burnFee;
        uint256 unlock = locked - fee;

        _burn(owner(), amount);

        ERC20(token).safeTransfer(_msgSender(), unlock);

        feeAmount = feeAmount + fee;
    }

    function quoteBurn(uint256 amount) public view returns (uint256 unlock, uint fee) {
        require(amount >= 10 ** decimals(), 'MINIMUM_BURN_AMOUNT');

        uint256 locked = amount * rate;
        fee = (locked / 100) * burnFee;
        unlock = locked - fee;
    }

    function setMintFee(uint256 newMintFee) public onlyOwner {
        require(newMintFee >= 1, 'MINIMUM_MINT_FEE');

        mintFee = newMintFee;
    }

    function setBurnFee(uint256 newBurnFee) public onlyOwner {
        require(newBurnFee >= 1, 'MINIMUM_BURN_FEE');

        burnFee = newBurnFee;
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
