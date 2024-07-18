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
    tbb: '0xC675576e90E904665B7d62FC92b7eeE425E0Ec4a',
    tbs: '0x4bE760BA0CB1F4D29e3EC88B4b1fa89678168B24',
    tbg: '0xE1A4d2d2617A2086179A3594E87Cc60dfd70b661',
  },
};

export const tokenDistributor: TokenDistributorAddress = {
  42161: '0x70520d9BF8FE4E9eE4aCEaE6168B629961AF0A11',
  421614: '0x7F80B08dDCE1737a6957C279d33EfAFCB354912C',
};

export const rewardSplitter: RewardSplitterAddress = {
  42161: '0xbBBbE9b62Cab1852461D4137b10E959F5577e5BE',
  421614: '0xB1AE2085f1F07dA9A69dF27d0cE4152a5973C7B8',
};

export const farmingSplitter: NetworkAddresses = {
  421614: '0x575dE4C35F6CCC8253B5DdD48207cA931a40f199',
};

export const stakingSplitter: NetworkAddresses = {
  421614: '0x0BF542f631e0DA3bb7aE493C5135cfa9518bb955',
};

export const boostingSplitter: NetworkAddresses = {
  421614: '0xBf5358e16e420D9b7B6e392D5BF057357B0E3a7C',
};

export const teamSplitter: NetworkAddresses = {
  421614: '0x45Ff6C4D195C5c41b201b66F93576656137322ce',
};
