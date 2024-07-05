// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library RewardsLibrary {
    struct RewardRate {
        uint ldt;
        uint tb;
    }

    struct Reward {
        uint ldt;
        uint tb;
        uint ldtLiquidity;
        uint tbLiquidity;
    }

    struct Farm {
        Reward liquidity;
        uint ldt;
        uint tb;
    }

    struct RewardsAmounts {
        Farm tbb;
        Farm tbs;
        Farm tbg;
    }

    struct TeamRewardsAmounts {
        uint ldt;
        uint tbb;
        uint tbs;
        uint tbg;
    }
}
