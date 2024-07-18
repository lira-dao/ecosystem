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
    tbb: '0xCec264f43805c8574C6257Ff12Cf5F5ad1CF27b0',
    tbs: '0xd5008f21487f6A0cD5Cf33796E7812f9cb65509A',
    tbg: '0x5FE45C8915F6f47529f3Ce30594f56dd3e88164d',
  },
};

export const boosterAddresses: BoosterAddresses = {
  421614: {
    tbb: '0xa1d4F6330Aaed01005D53fb2538BD93E03b4b182',
    tbs: '0x57189Bcaec82BbD1A213F9BcD1F4f6825640635B',
    tbg: '0xA44b389eF99dc2886409a1DF3e2cBfa9741013a3',
  },
};

export const tokenDistributor: TokenDistributorAddress = {
  42161: '0x70520d9BF8FE4E9eE4aCEaE6168B629961AF0A11',
  421614: '0x7F80B08dDCE1737a6957C279d33EfAFCB354912C',
};

export const rewardSplitter: RewardSplitterAddress = {
  42161: '0xbBBbE9b62Cab1852461D4137b10E959F5577e5BE',
  421614: '0xE62bDe9E11C83E37524a577C98fBC3ee2fB4Bd13',
};

export const farmingSplitter: NetworkAddresses = {
  421614: '0x413ab90C4E481F949f09c610aD907d927a2a4821',
};

export const stakingSplitter: NetworkAddresses = {
  421614: '0x80bb9540037f8EC217769173A185cFa1cbD1bB8A',
};

export const boostingSplitter: NetworkAddresses = {
  421614: '0x38B1794B1A7cEa2C7e54BD0358A2b18176236587',
};

export const teamSplitter: NetworkAddresses = {
  421614: '0x22ebfBce710aEc1Dd6aA780b8e766Fd615f5a5A9',
};
