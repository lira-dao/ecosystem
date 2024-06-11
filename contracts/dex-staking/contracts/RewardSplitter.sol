// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@lira-dao/token-distributor/contracts/interfaces/IDistributor.sol';
import '@lira-dao/treasury-tokens/contracts/interfaces/ITreasuryToken.sol';
import './interfaces/ILPStaker.sol';
import './interfaces/IUniswapV2Pair.sol';


contract RewardSplitter is Ownable2Step {
    struct Rewards {
        uint ldtBalance;
        uint ldtRewards;
        uint tbRewards;

        uint ldtFarmingRewards;
        uint ldtTeamRewards;

        uint tbFarmingRewardAmount;
        uint tbTeamRewardAmount;

        uint tbbFarmingRewardAmount;
        uint tbsFarmingRewardAmount;
        uint tbgFarmingRewardAmount;
    }

    struct RewardRate {
        uint ldt;
        uint tb;
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

    RewardRate public tbbRewardRate = RewardRate(10, 10);
    RewardRate public tbsRewardRate = RewardRate(10, 10);
    RewardRate public tbgRewardRate = RewardRate(10, 10);

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

    function requestDistribution() external onlyOwner {
        Rewards memory rewards = Rewards(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

        IDistributor(distributor).distribute();

        rewards.ldtBalance = IERC20(rewardToken).balanceOf(address(this));

        rewards.tbRewards = (rewards.ldtBalance * tbRate) / 100;
        rewards.ldtRewards = rewards.ldtBalance - rewards.tbRewards;

        rewards.ldtFarmingRewards = (rewards.ldtRewards * ldtFarmingReward) / 100;
        rewards.ldtTeamRewards = (rewards.ldtRewards * ldtTeamReward) / 100;

        rewards.tbFarmingRewardAmount = (rewards.tbRewards * tbFarmingReward) / 100;
        rewards.tbTeamRewardAmount = (rewards.tbRewards * tbTeamReward) / 100;

        rewards.tbbFarmingRewardAmount = (rewards.tbFarmingRewardAmount * 20) / 100;
        rewards.tbsFarmingRewardAmount = (rewards.tbFarmingRewardAmount * 30) / 100;
        rewards.tbgFarmingRewardAmount = rewards.tbFarmingRewardAmount - rewards.tbbFarmingRewardAmount - rewards.tbsFarmingRewardAmount;

        (uint tbbAmount0, uint tbbAmount1) = calculateStakingLiquidity(tbbFarmAddress, tbbRewardRate);
        (uint tbsAmount0, uint tbsAmount1) = calculateStakingLiquidity(tbsFarmAddress, tbsRewardRate);
        (uint tbgAmount0, uint tbgAmount1) = calculateStakingLiquidity(tbgFarmAddress, tbgRewardRate);

        uint totalLdt = tbbAmount0 + tbsAmount0 + tbgAmount0;

        if (totalLdt > rewards.ldtFarmingRewards) {
            uint tbbLiquidity = getLdtLiquidity(tbbFarmAddress);
            uint tbsLiquidity = getLdtLiquidity(tbsFarmAddress);
            uint tbgLiquidity = getLdtLiquidity(tbgFarmAddress);
            uint totalLiquidity = tbbLiquidity + tbsLiquidity + tbgLiquidity;

            IERC20(rewardToken).transfer(tbbFarmAddress, (tbbLiquidity * rewards.ldtFarmingRewards) / totalLiquidity);
            IERC20(rewardToken).transfer(tbsFarmAddress, (tbsLiquidity * rewards.ldtFarmingRewards) / totalLiquidity);
            IERC20(rewardToken).transfer(tbgFarmAddress, (tbgLiquidity * rewards.ldtFarmingRewards) / totalLiquidity);
        } else {
            IERC20(rewardToken).transfer(tbbFarmAddress, tbbAmount0);
            IERC20(rewardToken).transfer(tbsFarmAddress, tbsAmount0);
            IERC20(rewardToken).transfer(tbgFarmAddress, tbgAmount0);
        }

        if (tbbAmount1 > rewards.tbbFarmingRewardAmount / ITreasuryToken(tbbAddress).rate()) {
            // reward full block
            ITreasuryToken(tbbAddress).mint(tbbFarmAddress, rewards.tbbFarmingRewardAmount / ITreasuryToken(tbbAddress).rate());
        } else {
            // reward partial block
            ITreasuryToken(tbbAddress).mint(tbbFarmAddress, tbbAmount1);
        }

        if (tbsAmount1 > rewards.tbsFarmingRewardAmount / ITreasuryToken(tbsAddress).rate()) {
            // reward full block
            ITreasuryToken(tbsAddress).mint(tbsFarmAddress, rewards.tbsFarmingRewardAmount / ITreasuryToken(tbsAddress).rate());
        } else {
            // reward partial block
            ITreasuryToken(tbsAddress).mint(tbsFarmAddress, tbsAmount1);
        }

        if (tbgAmount1 > rewards.tbgFarmingRewardAmount / ITreasuryToken(tbgAddress).rate()) {
            // reward full block
            ITreasuryToken(tbgAddress).mint(tbgFarmAddress, rewards.tbgFarmingRewardAmount / ITreasuryToken(tbgAddress).rate());
        } else {
            // reward partial block
            ITreasuryToken(tbgAddress).mint(tbgFarmAddress, tbgAmount1);
        }
    }

    function getLdtLiquidity(address _farm) public view returns (uint256 liquidity) {
        address lpToken = ILPStaker(_farm).lpToken();

        liquidity = IERC20(rewardToken).balanceOf(lpToken);
    }

    function calculateStakingLiquidity(address _farm, RewardRate memory _rate) public view returns (uint256, uint256) {
        uint256 totalStaked = ILPStaker(_farm).totalStaked();
        address lpToken = ILPStaker(_farm).lpToken();
        uint256 lpTotalSupply = IERC20(lpToken).totalSupply();

        address t0 = IUniswapV2Pair(lpToken).token0();
        address t1 = IUniswapV2Pair(lpToken).token1();

        (address token0, address token1) = t0 == rewardToken ? (t0, t1) : (t1, t0);
        require(token0 == rewardToken, 'INVALID_REWARD_TOKEN');

        uint balance0 = IERC20(token0).balanceOf(lpToken);
        uint balance1 = IERC20(token1).balanceOf(lpToken);

        uint amount0 = (totalStaked * balance0) / lpTotalSupply;
        uint amount1 = (totalStaked * balance1) / lpTotalSupply;

        return ((amount0 * _rate.ldt) / 10000, (amount1 * _rate.tb) / 10000);
    }
}
