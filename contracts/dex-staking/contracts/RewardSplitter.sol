// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@lira-dao/token-distributor/contracts/interfaces/IDistributor.sol';
import '@lira-dao/treasury-tokens/contracts/interfaces/ITreasuryToken.sol';
import './interfaces/ILPStaker.sol';
import './interfaces/IUniswapV2Pair.sol';
import 'hardhat/console.sol';


contract RewardSplitter is Ownable2Step {
    struct Rewards {
        uint ldtRewards;
        uint tbRewards;
    }

    address public rewardToken;

    address public tbbAddress;
    address public tbsAddress;
    address public tbgAddress;

    address public tbbFarmAddress;
    address public tbsFarmAddress;
    address public tbgFarmAddress;

    address public distributor;

    uint8 public tbRate = 80;

    uint8 public tbFarmingReward = 40;
    uint8 public tbStakingReward = 25;
    uint8 public tbTeamReward = 10;
    uint8 public tbDaoFundReward = 10;
    uint8 public tbAmbassadorIncentiveReward = 10;
    uint8 public tbGreenEnergyProducersReward = 5;

    uint8 public ldtFarmingReward = 40;
    uint8 public ldtStakingReward = 20;
    uint8 public ldtTeamReward = 14;
    uint8 public ldtDaoFundReward = 10;
    uint8 public ldtAmbassadorIncentiveReward = 10;
    uint8 public ldtGreenEnergyProducersReward = 5;
    uint8 public ldtMarketingReward = 1;

    constructor(
        address _rewardToken,
        address _distributor,
        address _tbbAddress,
        address _tbbFarmAddress,
        address _tbsAddress,
        address _tbsFarmAddress,
        address _tbgAddress,
        address _tbgFarmAddress
    ) Ownable(msg.sender) {
        rewardToken = _rewardToken;
        distributor = _distributor;
        tbbAddress = _tbbAddress;
        tbbFarmAddress = _tbbFarmAddress;
        tbsAddress = _tbsAddress;
        tbsFarmAddress = _tbsFarmAddress;
        tbgAddress = _tbgAddress;
        tbgFarmAddress = _tbgFarmAddress;
    }

    function approveTb() public onlyOwner {
        IERC20(rewardToken).approve(tbbAddress, type(uint256).max);
        IERC20(rewardToken).approve(tbsAddress, type(uint256).max);
        IERC20(rewardToken).approve(tbgAddress, type(uint256).max);
    }

    function _getRewardTokenBalance() private view returns (uint) {
        return IERC20(rewardToken).balanceOf(address(this));
    }

    function _getRewards() private view returns (uint ldtRewards, uint tbRewards) {
        uint256 rewards = _getRewardTokenBalance();

        tbRewards = (rewards * tbRate) / 100;
        ldtRewards = rewards - tbRewards;
    }

    function _getLdtFarmingRewards() private view returns (uint ldtFarmingRewards, uint ldtTeamRewards) {
        (uint ldtRewards,) = _getRewards();

        ldtFarmingRewards = (ldtRewards * ldtFarmingReward) / 100;
        ldtTeamRewards = (ldtRewards * ldtTeamReward) / 100;
    }

    function requestDistribution() external onlyOwner {
        IDistributor(distributor).distribute();

        (uint ldtRewards, uint tbRewards) = _getRewards();
        (uint ldtFarmingRewards,) = _getLdtFarmingRewards();

        uint tbFarmingRewardAmount = (tbRewards * tbFarmingReward) / 100;
        uint tbTeamRewardAmount = (tbRewards * tbTeamReward) / 100;

        uint tbbFarmingRewardAmount;
        uint tbsFarmingRewardAmount;
        uint tbgFarmingRewardAmount;

        {
            tbbFarmingRewardAmount = ((tbFarmingRewardAmount * 20) / 100);
            tbsFarmingRewardAmount = ((tbFarmingRewardAmount * 30) / 100);
            tbgFarmingRewardAmount = (tbFarmingRewardAmount - tbbFarmingRewardAmount - tbsFarmingRewardAmount);
        }

//        console.log('rewards', tbAmount, ldtAmount);
//        console.log();
//        console.log('ldtFarmingRewardAmount', ldtFarmingRewardAmount / 1e18);
//        console.log('ldtTeamRewardAmount', ldtTeamRewardAmount / 1e18);
        console.log();
        console.log('tbFarmingRewardAmount', tbFarmingRewardAmount / 1e18);
//        console.log('tbTeamRewardAmount', tbTeamRewardAmount);
        console.log();


        console.log('tbbFarmingRewardAmount', tbbFarmingRewardAmount / ITreasuryToken(tbbAddress).rate());
        console.log('tbsFarmingRewardAmount', tbsFarmingRewardAmount / ITreasuryToken(tbsAddress).rate());
        console.log('tbgFarmingRewardAmount', tbgFarmingRewardAmount / ITreasuryToken(tbgAddress).rate());
//        console.log('tb total', tbbFarmingRewardAmount + tbsFarmingRewardAmount + tbgFarmingRewardAmount);
        console.log();

        (uint tbbAmount0, uint tbbAmount1) = calculateStakingLiquidity(tbbFarmAddress);
        (uint tbsAmount0, uint tbsAmount1) = calculateStakingLiquidity(tbsFarmAddress);
        (uint tbgAmount0, uint tbgAmount1) = calculateStakingLiquidity(tbgFarmAddress);

        uint totalLdt = tbbAmount0 + tbsAmount0 + tbgAmount0;

//        console.log('tbbActualReward', tbbAmount0, tbbAmount1);
//        console.log('tbsActualReward', tbsAmount0, tbsAmount1);
//        console.log('tbgActualReward', tbgAmount0, tbgAmount1);
//        console.log();
//
//        console.log('is max tbb', tbbAmount1 > tbbFarmingRewardAmount / ITreasuryToken(tbbAddress).rate());
//        console.log('is max tbs', tbsAmount1 > tbsFarmingRewardAmount / ITreasuryToken(tbsAddress).rate());
//        console.log('is max tbg', tbgAmount1 > tbgFarmingRewardAmount / ITreasuryToken(tbgAddress).rate());
//        console.log();

        if (totalLdt > ldtFarmingRewards) {
            console.log('ldt rewards full block');

            uint totalLiquidity;
            uint tbbLiquidity;
            uint tbsLiquidity;
            uint tbgLiquidity;

            {
                uint tbbLiquidity = getLdtLiquidity(tbbFarmAddress);
                uint tbsLiquidity = getLdtLiquidity(tbsFarmAddress);
                uint tbgLiquidity = getLdtLiquidity(tbgFarmAddress);
                uint totalLiquidity = tbbLiquidity + tbsLiquidity + tbgLiquidity;
            }

            IERC20(rewardToken).transfer(tbbFarmAddress, (tbbLiquidity * ldtFarmingRewards) / totalLiquidity);
            IERC20(rewardToken).transfer(tbsFarmAddress, (tbsLiquidity * ldtFarmingRewards) / totalLiquidity);
            IERC20(rewardToken).transfer(tbgFarmAddress, (tbgLiquidity * ldtFarmingRewards) / totalLiquidity);
        } else {
            console.log('ldt rewards partial block');
            IERC20(rewardToken).transfer(tbbFarmAddress, tbbAmount0);
            IERC20(rewardToken).transfer(tbsFarmAddress, tbsAmount0);
            IERC20(rewardToken).transfer(tbgFarmAddress, tbgAmount0);
        }

//        if (tbbAmount1 > tbbFarmingRewardAmount / ITreasuryToken(tbbAddress).rate()) {
//            // reward full block
//            ITreasuryToken(tbbAddress).mint(tbbFarmAddress, tbbFarmingRewardAmount / ITreasuryToken(tbbAddress).rate());
//        } else {
//            // reward partial block
//            ITreasuryToken(tbbAddress).mint(tbbFarmAddress, tbbAmount1);
//        }
//
//        if (tbsAmount1 > tbsFarmingRewardAmount / ITreasuryToken(tbsAddress).rate()) {
//            // reward full block
//            ITreasuryToken(tbsAddress).mint(tbsFarmAddress, tbsFarmingRewardAmount / ITreasuryToken(tbsAddress).rate());
//        } else {
//            // reward partial block
//            ITreasuryToken(tbsAddress).mint(tbsFarmAddress, tbsAmount1);
//        }
//
//        if (tbgAmount1 > tbgFarmingRewardAmount / ITreasuryToken(tbgAddress).rate()) {
//            // reward full block
//            ITreasuryToken(tbgAddress).mint(tbgFarmAddress, tbgFarmingRewardAmount / ITreasuryToken(tbgAddress).rate());
//        } else {
//            // reward partial block
//            ITreasuryToken(tbgAddress).mint(tbgFarmAddress, tbgAmount1);
//        }
    }

    function getLdtLiquidity(address _farm) public view returns (uint256 liquidity) {
        address lpToken = ILPStaker(_farm).lpToken();

        liquidity = IERC20(rewardToken).balanceOf(lpToken);
    }

    function calculateStakingLiquidity(address _farm) public view returns (uint256, uint256) {
        uint256 totalStaked = ILPStaker(_farm).totalStaked();
        address lpToken = ILPStaker(_farm).lpToken();
        uint256 lpTotalSupply = IERC20(lpToken).totalSupply();

        address t0 = IUniswapV2Pair(lpToken).token0();
        address t1 = IUniswapV2Pair(lpToken).token1();

        (address token0, address token1) = t0 == rewardToken ? (t0, t1) : (t1, t0);
        require(token0 == rewardToken, 'INVALID_REWARD_TOKEN');

        uint balance0 = IERC20(token0).balanceOf(lpToken);
        uint balance1 = IERC20(token1).balanceOf(lpToken);

        console.log('totalStaked', totalStaked / 1e18);
        console.log('lpTotalSupply', lpTotalSupply / 1e18);
        console.log('balances', balance0 / 1e18, balance1 / 1e18);

        uint amount0 = (totalStaked * balance0) / lpTotalSupply;
        uint amount1 = (totalStaked * balance1) / lpTotalSupply;

        // tot : 100 = x 1
        console.log('balance1', balance1);
        console.log('lpTotalSupply', lpTotalSupply);
        console.log('totalStaked', totalStaked);
        console.log('amounts', amount0, amount1);
        return ((amount0 * 10) / 10000, (amount1 * 10) / 10000);
    }

    // TODO: set distributor
}
