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
    tbb: '0xe9a072f85629D2bC5F0C0eD0ba591496A9a693C2',
    tbs: '0x7c8D044f10f053cDb05783DB1d55B386238dD9De',
    tbg: '0xcFeC968917c3633578c0bcE2Cac7A7C020CC92cC',
  },
};

export const tokenStakerAddresses: StakersAddresses = {
  421614: {
    tbb: '0x3b966493605F0E4830a494bbFE16359056F935BB',
    tbs: '0xa91e98f955F7F6800fF3ae0eBb41cdE4f4343460',
    tbg: '0x2c1903A7B091cde7Df3fc463918100AE9f5d7571',
  },
};

export const boosterAddresses: BoosterAddresses = {
  421614: {
    tbb: '0x93D74215B2E48eFD09b679eF3c1615DEc1c5D3C4',
    tbs: '0xF1B40B858B0C1448da1939bE344FBE6b1AE01745',
    tbg: '0xf0F9B30864846e363A91929E65999815c484f8E9',
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
