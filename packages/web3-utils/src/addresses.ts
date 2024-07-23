import {
  BoosterAddresses,
  BoostingStakers,
  FarmingStakers,
  FarmingStakersAddresses,
  NetworkAddresses,
  RewardSplitterAddress,
  StakersAddresses,
  TokenDistributorAddress,
  TokenStakers,
} from './types';
import { farmingStakersArbitrumOne } from './farming-stakers-arbitrum-one';
import { farmingStakersArbitrumSepolia } from './farming-stakers-arbitrum-sepolia';
import { tokenStakersArbitrumSepolia } from './token-stakers-arbitrum-sepolia';
import { tokenStakersArbitrumOne } from './token-stakers-arbitrum-one';
import { boostingStakersArbitrumSepolia } from './boosting-stakers-arbitrum-sepolia';
import { boostingStakersArbitrumOne } from './boosting-stakers-arbitrum-one';


export const farmingStakers: FarmingStakers = {
  42161: farmingStakersArbitrumOne,
  421614: farmingStakersArbitrumSepolia,
};

export const tokenStakers: TokenStakers = {
  42161: tokenStakersArbitrumOne,
  421614: tokenStakersArbitrumSepolia,
};

export const boostingStakers: BoostingStakers = {
  42161: boostingStakersArbitrumOne,
  421614: boostingStakersArbitrumSepolia,
};

export const farmingStakersAddresses: FarmingStakersAddresses = {
  42161: {
    tbb: '0x7aFfdD28D244FeBfB4A6e8db14D5aA42AB8396Ce',
    tbs: '0x0a84C2f54E3C7A00eb57922eEDB03440429E123b',
    tbg: '0xFA8c04138407756dDAe054287df603b3aed39662',
  },
  421614: {
    tbb: '0x24edD02ce869Db38C126B2bc4e9b9C273476e47A',
    tbs: '0x38a41092FB61c3535fF93cf38ffBfdEb23D3f481',
    tbg: '0x9115D49a15BB0Fb0363e9d913252ff606BDee877',
  },
};

export const tokenStakerAddresses: StakersAddresses = {
  421614: {
    tbb: '0x6D32D83943D8bFC906de6cf7a8BAEdA4Fecb1133',
    tbs: '0x0191bfD1f254Da13eb9328DF7Faf7878b0364AA9',
    tbg: '0xC7F6572dacc910957Fe78BA76B125620cDe680f0',
  },
};

export const boosterAddresses: BoosterAddresses = {
  421614: {
    tbb: '0xb3F0a4631f0d7b6197285D4bb9dd42ca2281b918',
    tbs: '0xa2B79258278F8ff324030a31B497D5595d65Aa08',
    tbg: '0xF465b5A42DF1cE60a152E0062E72eBDDa36b36E0',
  },
};

export const tokenDistributor: TokenDistributorAddress = {
  42161: '0x70520d9BF8FE4E9eE4aCEaE6168B629961AF0A11',
  421614: '0x7F80B08dDCE1737a6957C279d33EfAFCB354912C',
};

export const rewardSplitter: RewardSplitterAddress = {
  42161: '0xbBBbE9b62Cab1852461D4137b10E959F5577e5BE',
  421614: '0x2cA93153115CFD4C514589C916c8B29f6F6c4c13',
};

export const farmingSplitter: NetworkAddresses = {
  421614: '0x2054985389740a61B221dDd14b53c6D2E1d1401a',
};

export const stakingSplitter: NetworkAddresses = {
  421614: '0x65AfBbdb9dd41DCd29a361F3B1C389415013bB81',
};

export const boostingSplitter: NetworkAddresses = {
  421614: '0xdBbdb0c0D61c67177fBdE0e42B9d9646E0A0f82D',
};

export const teamSplitter: NetworkAddresses = {
  421614: '0xE139ff42d83b1a9fd9F9e1eFA74eFE3d78457c2e',
};
