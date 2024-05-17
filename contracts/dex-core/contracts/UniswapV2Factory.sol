pragma solidity =0.5.16;

import './interfaces/IUniswapV2Factory.sol';
import './UniswapV2Pair.sol';

contract UniswapV2Factory is IUniswapV2Factory {
    address public dao;
    address public feeTo;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    bool public onlyDaoCanOpen = true;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    modifier onlyDao() {
        require(msg.sender == dao, 'LIRA_DEX_ONLY_DAO');
        _;
    }

    constructor() public {
        dao = msg.sender;
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(!onlyDaoCanOpen || msg.sender == dao, 'LIRA_DEX_ONLY_DAO');
        require(tokenA != tokenB, 'UniswapV2: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'UniswapV2: PAIR_EXISTS'); // single check is sufficient
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IUniswapV2Pair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external onlyDao {
        feeTo = _feeTo;
    }

    function setDao(address _dao) external onlyDao {
        dao = _dao;
    }

    function setOnlyDaoCanOpen(bool _onlyDaoCanOpen) external onlyDao {
        onlyDaoCanOpen = _onlyDaoCanOpen;
    }

    function pairCodeHash() public pure returns (bytes32) {
        return keccak256(type(UniswapV2Pair).creationCode);
    }
}
