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
    tbb: '0x76C1309d4e2b233A2EBdfdcbe0E453A023CD0038',
    tbs: '0x5804bccC006D3705449C076a4f1E7A7BEa7208c1',
    tbg: '0x0Ad57a853496B391A01D8fd169F39f130E4a5E56',
  },
};

export const boosterAddresses: BoosterAddresses = {
  421614: {
    tbb: '0xc93cA41292f1D6fd81c419a65Ae53e896557de43',
    tbs: '0x63C902BD207bcEdBC98a7E71Eb9f5fA490A3D961',
    tbg: '0x287068e0bE3CC657726a664139Cfee9E6d1175B2',
  },
};

export const tokenDistributor: TokenDistributorAddress = {
  42161: '0x70520d9BF8FE4E9eE4aCEaE6168B629961AF0A11',
  421614: '0x7F80B08dDCE1737a6957C279d33EfAFCB354912C',
};

export const rewardSplitter: RewardSplitterAddress = {
  42161: '0xbBBbE9b62Cab1852461D4137b10E959F5577e5BE',
  421614: '0xDE693879cEa7bfFE655d32CC573dD788dBb7Ebdb',
};

export const farmingSplitter: NetworkAddresses = {
  421614: '0x38Bf30dB9a3Bf9544ec1A993a5a2305551810877',
};

export const stakingSplitter: NetworkAddresses = {
  421614: '0x6F10b8EbCf15237C5A94d2dA5B9fbd2E8A732b1F',
};

export const boostingSplitter: NetworkAddresses = {
  421614: '0x9fB065Acaa4a6f32d17D2F11Ff5ABf97bf9699Ce',
};

export const teamSplitter: NetworkAddresses = {
  421614: '0x3e7BcaB8C33dAC7Ba8Ad65c95bee89b2Fc53C51c',
};
