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
    tbb: '0xbE9c1F33baBFaBf56799d95e98568fA2283ad0f8',
    tbs: '0xDa00A425C576f0169A7Ed783eE8B401d1BCDE7b4',
    tbg: '0x61BecEF1d790A6a7b22e3b8b03c416eB04AdE3b3',
  },
};

export const tokenStakerAddresses: StakersAddresses = {
  421614: {
    tbb: '0x7B4Cf5543B3d01a5123a269b7839FFAeAaBdf986',
    tbs: '0x16bbd997ed34459c7781f2ec33372bD4D6c74C17',
    tbg: '0x48b75D4B3a663F682d3Fd60c2AB75fF3698875a1',
  },
};

export const boosterAddresses: BoosterAddresses = {
  421614: {
    tbb: '0x8C2A9F1e2f46b8e33D14025d4561f6D8B56DD236',
    tbs: '0x248C0609f1dAFacc5F583d8690FacdF45F5f07dC',
    tbg: '0x4F0B28393274afA760A33D1B0A75E96E2BBeAd84',
  },
};

export const tokenDistributor: TokenDistributorAddress = {
  42161: '0x70520d9BF8FE4E9eE4aCEaE6168B629961AF0A11',
  421614: '0x7F80B08dDCE1737a6957C279d33EfAFCB354912C',
};

export const rewardSplitter: RewardSplitterAddress = {
  42161: '0xbBBbE9b62Cab1852461D4137b10E959F5577e5BE',
  421614: '0x456D24a5E603b2aC383a52585aa6428419D46a4E',
};

export const farmingSplitter: NetworkAddresses = {
  421614: '0xf99b6954379bBa58cA783C89FB16354a96A0881a',
};

export const stakingSplitter: NetworkAddresses = {
  421614: '0xc542C50Ad4e89b16b37305dba1e8e0a2c8414b6B',
};

export const boostingSplitter: NetworkAddresses = {
  421614: '0xCd00F7F111fDcca06058A1191ACc989c93243973',
};

export const teamSplitter: NetworkAddresses = {
  421614: '0xa0E6C06573c5f1cD55D9DC1C87d9E64620D1776D',
};
