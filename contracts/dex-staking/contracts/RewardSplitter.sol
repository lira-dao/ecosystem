// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@lira-dao/token-distributor/contracts/interfaces/IDistributor.sol';
import '@lira-dao/treasury-tokens/contracts/interfaces/ITreasuryToken.sol';
import './interfaces/ILPStaker.sol';
import './interfaces/IStaker.sol';
import './interfaces/IUniswapV2Pair.sol';


/**
 * @title Reward Splitter V1
 * @author LIRA DAO Team
 * @custom:security-contact contact@liradao.org
 *
 * To know more about the ecosystem you can find us on https://liradao.org don't trust, verify!
 */
contract RewardSplitter is Ownable2Step {
    struct RewardLiquidity {
        uint rewardAmountLdt;
        uint rewardAmountTb;
        uint liquidityLdt;
        uint liquidityTb;
    }

    struct TokenStakingRewards {
        uint ldt;
        uint tb;

        uint tbbMintAmount;
        uint tbsMintAmount;
        uint tbgMintAmount;

        uint tbbTotalStaked;
        uint tbsTotalStaked;
        uint tbgTotalStaked;

        uint tbbAmount;
        uint tbbLdtAmount;

        uint tbsAmount;
        uint tbsLdtAmount;

        uint tbgAmount;
        uint tbgLdtAmount;

        RewardLiquidity tbbLiquidity;
        RewardLiquidity tbsLiquidity;
        RewardLiquidity tbgLiquidity;
    }

    struct Rewards {
        uint ldtBalance;
        uint ldtRewards;
        uint tbRewards;

        uint ldtFarmingReward;
        uint ldtTeamReward;

        uint tbFarmingReward;
        uint tbTeamReward;

        uint tbbFarmingReward;
        uint tbsFarmingReward;
        uint tbgFarmingReward;

        uint tbbTeamReward;
        uint tbsTeamReward;
        uint tbgTeamReward;

        uint tbbAmount;
        uint tbbLdtAmount;

        uint tbsAmount;
        uint tbsLdtAmount;

        uint tbgAmount;
        uint tbgLdtAmount;

        RewardLiquidity tbbLiquidity;
        RewardLiquidity tbsLiquidity;
        RewardLiquidity tbgLiquidity;

        TokenStakingRewards tokenStaking;
    }

    struct RewardRate {
        uint ldt;
        uint tb;
    }

    struct LdtSplit {
        uint8 farmingReward;
        uint8 stakingReward;
        uint8 teamReward;
        uint8 daoFundReward;
        uint8 ambassadorIncentiveReward;
        uint8 greenEnergyProducersReward;
        uint8 marketingReward;
    }

    struct TbSplit {
        uint8 farmingReward;
        uint8 stakingReward;
        uint8 teamReward;
        uint8 daoFundReward;
        uint8 ambassadorIncentiveReward;
        uint8 greenEnergyProducersReward;
    }

    RewardSplitterAddresses public addresses;

    uint8 public tbRate = 80;

    RewardRate public tbbFarmingRewardRate = RewardRate(200, 200);
    RewardRate public tbsFarmingRewardRate = RewardRate(500, 500);
    RewardRate public tbgFarmingRewardRate = RewardRate(1000, 1000);

    RewardRate public tbbStakingRewardRate = RewardRate(200, 200);
    RewardRate public tbsStakingRewardRate = RewardRate(500, 500);
    RewardRate public tbgStakingRewardRate = RewardRate(1000, 1000);

    RewardRate public teamRewardRate = RewardRate(1000, 1000);

    LdtSplit public ldtSplit = LdtSplit(20, 40, 10, 14, 10, 5, 1);
    TbSplit public tbSplit = TbSplit(40, 25, 10, 10, 10, 5);

    uint public constant MIN_RATE = 1;
    uint public constant MAX_RATE = 100_000;

    constructor(
        RewardSplitterAddresses memory _addresses
    ) Ownable(msg.sender) {
        addresses = _addresses;
    }

    function approveToken(address _token, address _spender) private {
        IERC20(_token).approve(_spender, type(uint256).max);
    }

    function approveTokens() public onlyOwner {
        approveToken(addresses.ldt, addresses.tbbAddress);
        approveToken(addresses.ldt, addresses.tbsAddress);
        approveToken(addresses.ldt, addresses.tbgAddress);

        approveToken(addresses.tbbAddress, addresses.tbbFarmAddress);
        approveToken(addresses.tbbAddress, addresses.tbbStakerAddress);
        approveToken(addresses.ldt, addresses.tbbFarmAddress);
        approveToken(addresses.ldt, addresses.tbbStakerAddress);

        approveToken(addresses.tbsAddress, addresses.tbsFarmAddress);
        approveToken(addresses.tbsAddress, addresses.tbsStakerAddress);
        approveToken(addresses.ldt, addresses.tbsFarmAddress);
        approveToken(addresses.ldt, addresses.tbsStakerAddress);

        approveToken(addresses.tbgAddress, addresses.tbgFarmAddress);
        approveToken(addresses.tbgAddress, addresses.tbgStakerAddress);
        approveToken(addresses.ldt, addresses.tbgFarmAddress);
        approveToken(addresses.ldt, addresses.tbgStakerAddress);
    }

    function requestDistribution() external onlyOwner {
        Rewards memory rewards = Rewards(
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            RewardLiquidity(0, 0, 0, 0), RewardLiquidity(0, 0, 0, 0), RewardLiquidity(0, 0, 0, 0),
            TokenStakingRewards(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, RewardLiquidity(0, 0, 0, 0), RewardLiquidity(0, 0, 0, 0), RewardLiquidity(0, 0, 0, 0))
        );

        IDistributor(addresses.distributor).distribute();

        rewards.ldtBalance = IERC20(addresses.ldt).balanceOf(address(this));

        // total rewards
        rewards.tbRewards = (rewards.ldtBalance * tbRate) / 100;
        rewards.ldtRewards = rewards.ldtBalance - rewards.tbRewards;

        // total farming rewards
        rewards.ldtFarmingReward = (rewards.ldtRewards * ldtSplit.farmingReward) / 100;
        rewards.tbFarmingReward = (rewards.tbRewards * tbSplit.farmingReward) / 100;

        // tb farming rewards
        rewards.tbbFarmingReward = (rewards.tbFarmingReward * 20) / 100;
        rewards.tbsFarmingReward = (rewards.tbFarmingReward * 30) / 100;
        rewards.tbgFarmingReward = rewards.tbFarmingReward - rewards.tbbFarmingReward - rewards.tbsFarmingReward;

        // farming liquidity
        rewards.tbbLiquidity = calculateStakingLiquidity(addresses.tbbFarmAddress, tbbFarmingRewardRate);
        rewards.tbsLiquidity = calculateStakingLiquidity(addresses.tbsFarmAddress, tbsFarmingRewardRate);
        rewards.tbgLiquidity = calculateStakingLiquidity(addresses.tbgFarmAddress, tbgFarmingRewardRate);

        // total staking rewards
        rewards.tokenStaking.ldt = (rewards.ldtRewards * ldtSplit.stakingReward) / 100;
        rewards.tokenStaking.tb = (rewards.tbRewards * tbSplit.farmingReward) / 100;

        // tb staking rewards
        rewards.tokenStaking.tbbMintAmount = (rewards.tokenStaking.tb * 20) / 100;
        rewards.tokenStaking.tbsMintAmount = (rewards.tokenStaking.tb * 30) / 100;
        rewards.tokenStaking.tbgMintAmount = rewards.tokenStaking.tb - rewards.tokenStaking.tbbMintAmount - rewards.tokenStaking.tbsMintAmount;

        rewards.tokenStaking.tbbTotalStaked = IStaker(addresses.tbbStakerAddress).totalStaked() / 2;
        rewards.tokenStaking.tbsTotalStaked = IStaker(addresses.tbsStakerAddress).totalStaked() / 2;
        rewards.tokenStaking.tbgTotalStaked = IStaker(addresses.tbgStakerAddress).totalStaked() / 2;

        // staking liquidity
        rewards.tokenStaking.tbbLiquidity.rewardAmountLdt = (rewards.tokenStaking.tbbTotalStaked * ITreasuryToken(addresses.tbbAddress).rate() * tbbStakingRewardRate.ldt) / MAX_RATE;
        rewards.tokenStaking.tbbLiquidity.rewardAmountTb = (rewards.tokenStaking.tbbTotalStaked * tbbStakingRewardRate.tb) / MAX_RATE;

        rewards.tokenStaking.tbsLiquidity.rewardAmountLdt = (rewards.tokenStaking.tbsTotalStaked * ITreasuryToken(addresses.tbsAddress).rate() * tbsStakingRewardRate.ldt) / MAX_RATE;
        rewards.tokenStaking.tbsLiquidity.rewardAmountTb = (rewards.tokenStaking.tbsTotalStaked * tbsStakingRewardRate.tb) / MAX_RATE;

        rewards.tokenStaking.tbgLiquidity.rewardAmountLdt = (rewards.tokenStaking.tbgTotalStaked * ITreasuryToken(addresses.tbgAddress).rate() * tbgStakingRewardRate.ldt) / MAX_RATE;
        rewards.tokenStaking.tbgLiquidity.rewardAmountTb = (rewards.tokenStaking.tbgTotalStaked * tbgStakingRewardRate.tb) / MAX_RATE;

         uint totalStakingLdt = rewards.tokenStaking.tbbLiquidity.liquidityLdt + rewards.tokenStaking.tbsLiquidity.liquidityLdt + rewards.tokenStaking.tbgLiquidity.liquidityLdt;

        if (totalStakingLdt > rewards.tokenStaking.ldt) {
            uint tbbLiquidity = rewards.tokenStaking.tbbTotalStaked * ITreasuryToken(addresses.tbbAddress).rate();
            uint tbsLiquidity = rewards.tokenStaking.tbsTotalStaked * ITreasuryToken(addresses.tbsAddress).rate();
            uint tbgLiquidity = rewards.tokenStaking.tbgTotalStaked * ITreasuryToken(addresses.tbgAddress).rate();
            uint totalLiquidity = tbbLiquidity + tbsLiquidity + tbgLiquidity;

            rewards.tokenStaking.tbbLdtAmount = (tbbLiquidity * rewards.tokenStaking.ldt) / totalLiquidity;
            rewards.tokenStaking.tbsLdtAmount = (tbsLiquidity * rewards.tokenStaking.ldt) / totalLiquidity;
            rewards.tokenStaking.tbgLdtAmount = (tbgLiquidity * rewards.tokenStaking.ldt) / totalLiquidity;
        } else {
            rewards.tokenStaking.tbbLdtAmount = rewards.tokenStaking.tbbLiquidity.rewardAmountLdt;
            rewards.tokenStaking.tbsLdtAmount = rewards.tokenStaking.tbsLiquidity.rewardAmountLdt;
            rewards.tokenStaking.tbgLdtAmount = rewards.tokenStaking.tbgLiquidity.rewardAmountLdt;
        }

        uint totalLdt = rewards.tbbLiquidity.rewardAmountLdt + rewards.tbsLiquidity.rewardAmountLdt + rewards.tbgLiquidity.rewardAmountLdt;

        if (totalLdt > rewards.ldtFarmingReward) {
            uint tbbLiquidity = getLdtLiquidity(addresses.tbbFarmAddress);
            uint tbsLiquidity = getLdtLiquidity(addresses.tbsFarmAddress);
            uint tbgLiquidity = getLdtLiquidity(addresses.tbgFarmAddress);
            uint totalLiquidity = tbbLiquidity + tbsLiquidity + tbgLiquidity;

            rewards.tbbLdtAmount = (tbbLiquidity * rewards.ldtFarmingReward) / totalLiquidity;
            rewards.tbsLdtAmount = (tbsLiquidity * rewards.ldtFarmingReward) / totalLiquidity;
            rewards.tbgLdtAmount = (tbgLiquidity * rewards.ldtFarmingReward) / totalLiquidity;
        } else {
            rewards.tbbLdtAmount = rewards.tbbLiquidity.rewardAmountLdt;
            rewards.tbsLdtAmount = rewards.tbsLiquidity.rewardAmountLdt;
            rewards.tbgLdtAmount = rewards.tbgLiquidity.rewardAmountLdt;
        }

        if (rewards.tbbLiquidity.rewardAmountTb > rewards.tbbFarmingReward / ITreasuryToken(addresses.tbbAddress).rate()) {
            ITreasuryToken(addresses.tbbAddress).mint(address(this), rewards.tbbFarmingReward / ITreasuryToken(addresses.tbbAddress).rate());
        } else {
            ITreasuryToken(addresses.tbbAddress).mint(address(this), rewards.tbbLiquidity.rewardAmountTb);
        }

        rewards.tbbAmount = IERC20(addresses.tbbAddress).balanceOf(address(this));

        if (rewards.tbsLiquidity.rewardAmountTb > rewards.tbsFarmingReward / ITreasuryToken(addresses.tbsAddress).rate()) {
            ITreasuryToken(addresses.tbsAddress).mint(address(this), rewards.tbsFarmingReward / ITreasuryToken(addresses.tbsAddress).rate());
        } else {
            ITreasuryToken(addresses.tbsAddress).mint(address(this), rewards.tbsLiquidity.rewardAmountTb);
        }

        rewards.tbsAmount = IERC20(addresses.tbsAddress).balanceOf(address(this));

        if (rewards.tbgLiquidity.rewardAmountTb > rewards.tbgFarmingReward / ITreasuryToken(addresses.tbgAddress).rate()) {
            ITreasuryToken(addresses.tbgAddress).mint(address(this), rewards.tbgLiquidity.rewardAmountTb / ITreasuryToken(addresses.tbgAddress).rate());
        } else {
            ITreasuryToken(addresses.tbgAddress).mint(address(this), rewards.tbgLiquidity.rewardAmountTb);
        }

        rewards.tbgAmount = IERC20(addresses.tbgAddress).balanceOf(address(this));

        ILPStaker(addresses.tbbFarmAddress).distributeRewards(rewards.tbbLdtAmount, rewards.tbbAmount);
        ILPStaker(addresses.tbsFarmAddress).distributeRewards(rewards.tbsLdtAmount, rewards.tbsAmount);
        ILPStaker(addresses.tbgFarmAddress).distributeRewards(rewards.tbgLdtAmount, rewards.tbgAmount);

        // staking rewards

        if (ldtSplit.teamReward > 0) {
            rewards.ldtTeamReward = (rewards.ldtRewards * ldtSplit.teamReward) / 100;
            rewards.tbTeamReward = (rewards.tbRewards * tbSplit.teamReward) / 100;

            rewards.tbbTeamReward = (rewards.tbTeamReward * 20) / 100;
            rewards.tbsTeamReward = (rewards.tbTeamReward * 30) / 100;
            rewards.tbgTeamReward = rewards.tbTeamReward - rewards.tbbTeamReward - rewards.tbsTeamReward;

            uint totalLdtLiquidity = rewards.tbbLiquidity.liquidityLdt + rewards.tbsLiquidity.liquidityLdt + rewards.tbgLiquidity.liquidityLdt;

            uint teamLdtReward = (totalLdtLiquidity * teamRewardRate.ldt) / MAX_RATE;

            if (teamLdtReward < rewards.ldtTeamReward) {
                rewards.ldtTeamReward = teamLdtReward;
            }

            if ((rewards.tbbLiquidity.liquidityTb * teamRewardRate.tb) / MAX_RATE > rewards.tbbTeamReward / ITreasuryToken(addresses.tbbAddress).rate()) {
                ITreasuryToken(addresses.tbbAddress).mint(addresses.teamAddress, rewards.tbbTeamReward / ITreasuryToken(addresses.tbbAddress).rate());
            } else {
                ITreasuryToken(addresses.tbbAddress).mint(addresses.teamAddress, (rewards.tbbLiquidity.liquidityTb * teamRewardRate.tb) / MAX_RATE);
            }

            if ((rewards.tbsLiquidity.liquidityTb * teamRewardRate.tb) / MAX_RATE > rewards.tbsTeamReward / ITreasuryToken(addresses.tbsAddress).rate()) {
                ITreasuryToken(addresses.tbsAddress).mint(addresses.teamAddress, rewards.tbsTeamReward / ITreasuryToken(addresses.tbsAddress).rate());
            } else {
                ITreasuryToken(addresses.tbsAddress).mint(addresses.teamAddress, (rewards.tbsLiquidity.liquidityTb * teamRewardRate.tb) / MAX_RATE);
            }

            if ((rewards.tbgLiquidity.liquidityTb * teamRewardRate.tb) / MAX_RATE > rewards.tbgTeamReward / ITreasuryToken(addresses.tbgAddress).rate()) {
                ITreasuryToken(addresses.tbgAddress).mint(addresses.teamAddress, rewards.tbgTeamReward / ITreasuryToken(addresses.tbgAddress).rate());
            } else {
                ITreasuryToken(addresses.tbgAddress).mint(addresses.teamAddress, (rewards.tbgLiquidity.liquidityTb * teamRewardRate.tb) / MAX_RATE);
            }
        }

        // staking rewards
        ITreasuryToken(addresses.tbbAddress).mint(address(this), rewards.tokenStaking.tbbAmount / ITreasuryToken(addresses.tbbAddress).rate());
        rewards.tokenStaking.tbbAmount = IERC20(addresses.tbbAddress).balanceOf(address(this));

        ITreasuryToken(addresses.tbsAddress).mint(address(this), rewards.tokenStaking.tbsAmount / ITreasuryToken(addresses.tbsAddress).rate());
        rewards.tokenStaking.tbsAmount = IERC20(addresses.tbsAddress).balanceOf(address(this));

        ITreasuryToken(addresses.tbgAddress).mint(address(this), rewards.tokenStaking.tbgAmount / ITreasuryToken(addresses.tbgAddress).rate());
        rewards.tokenStaking.tbgAmount = IERC20(addresses.tbgAddress).balanceOf(address(this));

        IStaker(addresses.tbbStakerAddress).distributeRewards(rewards.tokenStaking.tbbLdtAmount, rewards.tokenStaking.tbbAmount);
        IStaker(addresses.tbsStakerAddress).distributeRewards(rewards.tokenStaking.tbsLdtAmount, rewards.tokenStaking.tbsAmount);
        IStaker(addresses.tbgStakerAddress).distributeRewards(rewards.tokenStaking.tbgLdtAmount, rewards.tokenStaking.tbgAmount);

        IERC20(addresses.ldt).transfer(addresses.teamAddress, rewards.ldtTeamReward);

        if (IERC20(addresses.ldt).balanceOf(address(this)) > 0) {
            IERC20(addresses.ldt).transfer(addresses.distributor, IERC20(addresses.ldt).balanceOf(address(this)));
        }
    }

    function getLdtLiquidity(address _farm) public view returns (uint256 liquidity) {
        address lpToken = ILPStaker(_farm).lpToken();

        liquidity = IERC20(addresses.ldt).balanceOf(lpToken);
    }

    function calculateStakingLiquidity(address _farm, RewardRate memory _rate) public view returns (RewardLiquidity memory) {
        uint256 totalStaked = ILPStaker(_farm).totalStaked();
        address lpToken = ILPStaker(_farm).lpToken();
        uint256 lpTotalSupply = IERC20(lpToken).totalSupply();

        address t0 = IUniswapV2Pair(lpToken).token0();
        address t1 = IUniswapV2Pair(lpToken).token1();

        (address token0, address token1) = t0 == addresses.ldt ? (t0, t1) : (t1, t0);
        require(token0 == addresses.ldt, 'INVALID_TOKEN');

        uint balance0 = IERC20(token0).balanceOf(lpToken);
        uint balance1 = IERC20(token1).balanceOf(lpToken);

        uint amount0 = (totalStaked * balance0) / lpTotalSupply;
        uint amount1 = (totalStaked * balance1) / lpTotalSupply;

        return RewardLiquidity(
            (amount0 * _rate.ldt) / MAX_RATE,
            (amount1 * _rate.tb) / MAX_RATE,
            amount0,
            amount1
        );
    }

    function setTbbFarmingRewardRate(uint _ldtRate, uint _tbbRate) external onlyOwner {
        require(_ldtRate >= MIN_RATE && _ldtRate <= MAX_RATE, 'INVALID_LDT_RATE');
        require(_tbbRate >= MIN_RATE && _tbbRate <= MAX_RATE, 'INVALID_TB_RATE');

        tbbFarmingRewardRate.ldt = _ldtRate;
        tbbFarmingRewardRate.tb = _tbbRate;
    }

    function setTbsFarmingRewardRate(uint _ldtRate, uint _tbsRate) external onlyOwner {
        require(_ldtRate >= MIN_RATE && _ldtRate <= MAX_RATE, 'INVALID_LDT_RATE');
        require(_tbsRate >= MIN_RATE && _tbsRate <= MAX_RATE, 'INVALID_TB_RATE');

        tbsFarmingRewardRate.ldt = _ldtRate;
        tbsFarmingRewardRate.tb = _tbsRate;
    }

    function setTbgFarmingRewardRate(uint _ldtRate, uint _tbgRate) external onlyOwner {
        require(_ldtRate >= MIN_RATE && _ldtRate <= MAX_RATE, 'INVALID_LDT_RATE');
        require(_tbgRate >= MIN_RATE && _tbgRate <= MAX_RATE, 'INVALID_TB_RATE');

        tbgFarmingRewardRate.ldt = _ldtRate;
        tbgFarmingRewardRate.tb = _tbgRate;
    }

    function setTbbStakingRewardRate(uint _ldtRate, uint _tbbRate) external onlyOwner {
        require(_ldtRate >= MIN_RATE && _ldtRate <= MAX_RATE, 'INVALID_LDT_RATE');
        require(_tbbRate >= MIN_RATE && _tbbRate <= MAX_RATE, 'INVALID_TB_RATE');

        tbbStakingRewardRate.ldt = _ldtRate;
        tbbStakingRewardRate.tb = _tbbRate;
    }

    function setTbsStakingRewardRate(uint _ldtRate, uint _tbsRate) external onlyOwner {
        require(_ldtRate >= MIN_RATE && _ldtRate <= MAX_RATE, 'INVALID_LDT_RATE');
        require(_tbsRate >= MIN_RATE && _tbsRate <= MAX_RATE, 'INVALID_TB_RATE');

        tbsStakingRewardRate.ldt = _ldtRate;
        tbsStakingRewardRate.tb = _tbsRate;
    }

    function setTbgStakingRewardRate(uint _ldtRate, uint _tbgRate) external onlyOwner {
        require(_ldtRate >= MIN_RATE && _ldtRate <= MAX_RATE, 'INVALID_LDT_RATE');
        require(_tbgRate >= MIN_RATE && _tbgRate <= MAX_RATE, 'INVALID_TB_RATE');

        tbgStakingRewardRate.ldt = _ldtRate;
        tbgStakingRewardRate.tb = _tbgRate;
    }

    function setTeamRewardRate(uint _ldtRate, uint _tbgRate) external onlyOwner {
        require(_ldtRate >= MIN_RATE && _ldtRate <= MAX_RATE, 'INVALID_LDT_RATE');
        require(_tbgRate >= MIN_RATE && _tbgRate <= MAX_RATE, 'INVALID_TB_RATE');

        teamRewardRate.ldt = _ldtRate;
        teamRewardRate.tb = _tbgRate;
    }

    function setTeamAddress(address _teamAddress) external onlyOwner {
        addresses.teamAddress = _teamAddress;
    }

    function recoverOwnershipTbb() external onlyOwner {
        Ownable(addresses.tbbAddress).transferOwnership(owner());
    }

    function recoverOwnershipTbs() external onlyOwner {
        Ownable(addresses.tbsAddress).transferOwnership(owner());
    }

    function recoverOwnershipTbg() external onlyOwner {
        Ownable(addresses.tbgAddress).transferOwnership(owner());
    }

    function recoverOwnershipTbbFarm() external onlyOwner {
        Ownable(addresses.tbbFarmAddress).transferOwnership(owner());
    }

    function recoverOwnershipTbsFarm() external onlyOwner {
        Ownable(addresses.tbsFarmAddress).transferOwnership(owner());
    }

    function recoverOwnershipTbgFarm() external onlyOwner {
        Ownable(addresses.tbgFarmAddress).transferOwnership(owner());
    }

    function setDistributor(address _distributor) external onlyOwner {
        addresses.distributor = _distributor;
    }

//    function setLdtSplit(LdtSplit memory _ldtSplit) external onlyOwner {
//        require(
//            _ldtSplit.farmingReward +
//            _ldtSplit.stakingReward +
//            _ldtSplit.teamReward +
//            _ldtSplit.daoFundReward +
//            _ldtSplit.ambassadorIncentiveReward +
//            _ldtSplit.greenEnergyProducersReward +
//            _ldtSplit.marketingReward <= 100,
//            'INVALID_SPLIT'
//        );
//
//        ldtSplit = _ldtSplit;
//    }

//    function setTbSplit(TbSplit memory _tbSplit) external onlyOwner {
//        require(
//            _tbSplit.farmingReward +
//            _tbSplit.stakingReward +
//            _tbSplit.teamReward +
//            _tbSplit.daoFundReward +
//            _tbSplit.ambassadorIncentiveReward +
//            _tbSplit.greenEnergyProducersReward <= 100,
//            'INVALID_SPLIT'
//        );
//
//        tbSplit = _tbSplit;
//    }
}
