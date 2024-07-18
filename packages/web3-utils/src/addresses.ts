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
    tbb: '0x03D1A1eD0c3a09Cf0e6cCd7116c3a783E1513a31',
    tbs: '0x1e0b6b1b93cb482b89F8d312BF3C297fbFAB0ac4',
    tbg: '0xf16eEdb98120001FeeaDc0eB105C44607DdDf049',
  },
};

export const boosterAddresses: BoosterAddresses = {
  421614: {
    tbb: '0x47B2F34Cc120fA563464B5146aCC6D49EB6518e1',
    tbs: '0x0069225C85b9DfCF7Ee58c176EFf8A266523B00B',
    tbg: '0x159Afad04C79ae166b8FC541DEB4116dDe97cC23',
  },
};

export const tokenDistributor: TokenDistributorAddress = {
  42161: '0x70520d9BF8FE4E9eE4aCEaE6168B629961AF0A11',
  421614: '0x7F80B08dDCE1737a6957C279d33EfAFCB354912C',
};

export const rewardSplitter: RewardSplitterAddress = {
  42161: '0xbBBbE9b62Cab1852461D4137b10E959F5577e5BE',
  421614: '0x91e2F13E28E967768864dD01d557Dea3abA0303F',
};

export const farmingSplitter: NetworkAddresses = {
  421614: '0xBeA2081A095de0bD0B6cb8eb5dBbFB95FB20EdE5',
};

export const stakingSplitter: NetworkAddresses = {
  421614: '0x9a8c944dC3D6c3E8cE162016E2584322aA848f93',
};

export const boostingSplitter: NetworkAddresses = {
  421614: '0x06CC0F3BF922186F96a8870A89FCD065E43DFe91',
};

export const teamSplitter: NetworkAddresses = {
  421614: '0x7495E5a608232093D84B5f0C2Bd286643C3bA1e1',
};
