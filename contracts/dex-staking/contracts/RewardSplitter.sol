// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@lira-dao/token-distributor/contracts/interfaces/IDistributor.sol';
import '@lira-dao/treasury-tokens/contracts/interfaces/ITreasuryToken.sol';
import './interfaces/IStaker.sol';
import './interfaces/ISplitter.sol';
import './interfaces/ITeamSplitter.sol';
import './libs/RewardsLibrary.sol';


contract RewardSplitterV2 is Ownable2Step {
    struct DoubleReward {
        uint ldt;
        uint tb;
    }

    struct Rewards {
        uint total;
        uint ldt;
        uint tb;
        DoubleReward farming;
        DoubleReward staking;
        DoubleReward team;
    }

    struct LdtRewards {
        uint8 farming;
        uint8 staking;
        uint8 team;
        uint8 daoFund;
        uint8 ambassadorIncentive;
        uint8 greenEnergy;
        uint8 marketing;
    }

    struct TbRewards {
        uint8 farming;
        uint8 staking;
        uint8 team;
        uint8 daoFund;
        uint8 ambassadorIncentive;
        uint8 greenEnergy;
    }

    address public distributor;

    address public ldt;
    address public tbb;
    address public tbs;
    address public tbg;

    address[] public farms;
    address[] public stakers;

    address public farmSplitter;
    address public stakingSplitter;
    address public teamSplitter;

    address public teamVault;

    uint8 public tbRate = 80;

    LdtRewards public ldtRewards = LdtRewards(20, 40, 10, 14, 10, 5, 1);
    TbRewards public tbRewards = TbRewards(40, 25, 10, 10, 10, 5);

    event DistributeRewards(Rewards rewards);
    event DistributeFarmingRewards(RewardsLibrary.RewardsAmounts rewards);
    event DistributeStakingRewards(RewardsLibrary.RewardsAmounts rewards);
    event DistributeTeamRewards(RewardsLibrary.TeamRewardsAmounts rewards);

    constructor(
        address _ldt,
        address _tbb,
        address _tbs,
        address _tbg,
        address _distributor,
        address _farmSplitter,
        address _stakingSplitter,
        address _teamSplitter,
        address _teamVault,
        address[] memory _farms,
        address[] memory _stakers
    ) Ownable(msg.sender) {
        ldt = _ldt;
        tbb = _tbb;
        tbs = _tbs;
        tbg = _tbg;
        distributor = _distributor;
        farmSplitter = _farmSplitter;
        stakingSplitter = _stakingSplitter;
        teamSplitter = _teamSplitter;
        teamVault = _teamVault;
        farms = _farms;
        stakers = _stakers;
    }

    function approve(address _token, address _spender) private {
        IERC20(_token).approve(_spender, type(uint256).max);
    }

    function approveTokens() public {
        approve(ldt, tbb);
        approve(ldt, tbs);
        approve(ldt, tbg);

        approve(ldt, farms[0]);
        approve(tbb, farms[0]);

        approve(ldt, stakers[0]);
        approve(tbb, stakers[0]);

        approve(ldt, farms[1]);
        approve(tbs, farms[1]);

        approve(ldt, stakers[1]);
        approve(tbs, stakers[1]);

        approve(ldt, farms[2]);
        approve(tbg, farms[2]);

        approve(ldt, stakers[2]);
        approve(tbg, stakers[2]);
    }

    function distributeRewards() public onlyOwner {
        IDistributor(distributor).distribute();

        Rewards memory rewards;

        rewards.total = IERC20(ldt).balanceOf(address(this));

        // total rewards
        rewards.tb = (rewards.total * tbRate) / 100;
        rewards.ldt = rewards.total - rewards.tb;

        rewards.farming.ldt = (rewards.ldt * ldtRewards.farming) / 100;
        rewards.farming.tb = (rewards.tb * tbRewards.farming) / 100;

        rewards.staking.ldt = (rewards.ldt * ldtRewards.staking) / 100;
        rewards.staking.tb = (rewards.tb * tbRewards.staking) / 100;

        rewards.team.ldt = (rewards.ldt * ldtRewards.team) / 100;
        rewards.team.tb = (rewards.tb * tbRewards.team) / 100;

        RewardsLibrary.RewardsAmounts memory farmingRewards = ISplitter(farmSplitter).calculate(rewards.farming.ldt, rewards.farming.tb);

        RewardsLibrary.RewardsAmounts memory stakingRewards = ISplitter(stakingSplitter).calculate(rewards.staking.ldt, rewards.staking.tb);

        uint ldtLiquidity =
            farmingRewards.tbb.liquidity.ldtLiquidity +
            stakingRewards.tbb.liquidity.ldtLiquidity +
            farmingRewards.tbs.liquidity.ldtLiquidity +
            stakingRewards.tbs.liquidity.ldtLiquidity +
            farmingRewards.tbg.liquidity.ldtLiquidity +
            stakingRewards.tbg.liquidity.ldtLiquidity;

        uint tbbLiquidity =
            farmingRewards.tbb.liquidity.tbLiquidity +
            stakingRewards.tbb.liquidity.tbLiquidity;

        uint tbsLiquidity =
            farmingRewards.tbs.liquidity.tbLiquidity +
            stakingRewards.tbs.liquidity.tbLiquidity;

        uint tbgLiquidity =
            farmingRewards.tbg.liquidity.tbLiquidity +
            stakingRewards.tbg.liquidity.tbLiquidity;

        RewardsLibrary.TeamRewardsAmounts memory teamRewards = ITeamSplitter(teamSplitter).calculate(rewards.team.ldt, ldtLiquidity, rewards.team.tb, tbbLiquidity, tbsLiquidity, tbgLiquidity);

        ITreasuryToken(tbb).mint(address(this), farmingRewards.tbb.tb);
        ITreasuryToken(tbs).mint(address(this), farmingRewards.tbs.tb);
        ITreasuryToken(tbg).mint(address(this), farmingRewards.tbg.tb);

        IStaker(farms[0]).distributeRewards(farmingRewards.tbb.ldt, farmingRewards.tbb.tb);
        IStaker(farms[1]).distributeRewards(farmingRewards.tbs.ldt, farmingRewards.tbs.tb);
        IStaker(farms[2]).distributeRewards(farmingRewards.tbg.ldt, farmingRewards.tbg.tb);

        ITreasuryToken(tbb).mint(address(this), stakingRewards.tbb.tb);
        ITreasuryToken(tbs).mint(address(this), stakingRewards.tbs.tb);
        ITreasuryToken(tbg).mint(address(this), stakingRewards.tbg.tb);

        IStaker(stakers[0]).distributeRewards(stakingRewards.tbb.ldt, stakingRewards.tbb.tb);
        IStaker(stakers[1]).distributeRewards(stakingRewards.tbs.ldt, stakingRewards.tbs.tb);
        IStaker(stakers[2]).distributeRewards(stakingRewards.tbg.ldt, stakingRewards.tbg.tb);

        IERC20(ldt).transfer(teamVault, teamRewards.ldt);
        ITreasuryToken(tbb).mint(teamVault, teamRewards.tbb);
        ITreasuryToken(tbs).mint(teamVault, teamRewards.tbs);
        ITreasuryToken(tbg).mint(teamVault, teamRewards.tbg);

        if (IERC20(ldt).balanceOf(address(this)) > 0) {
            IERC20(ldt).transfer(distributor, IERC20(ldt).balanceOf(address(this)));
        }

        emit DistributeFarmingRewards(farmingRewards);
        emit DistributeStakingRewards(stakingRewards);
        emit DistributeTeamRewards(teamRewards);
        emit DistributeRewards(rewards);
    }

    function recoverOwnership(address _address) external onlyOwner {
        Ownable(_address).transferOwnership(owner());
    }
}
