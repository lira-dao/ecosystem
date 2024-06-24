// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


contract AddressBook {
    struct TokensAddresses {
        address ldt;
        address tbb;
        address tbs;
        address tbg;
    }

    struct FarmsAddresses {
        address tbb;
        address tbs;
        address tbg;
    }

    struct StakersAddresses {
        address tbb;
        address tbs;
        address tbg;
    }

    TokensAddresses public tokens;

    FarmsAddresses public farms;

    StakersAddresses public stakers;

    constructor(
        TokensAddresses memory _tokens,
        FarmsAddresses memory _farms,
        StakersAddresses memory _stakers
    ) {
        tokens = _tokens;
        farms = _farms;
        stakers = _stakers;
    }
}
