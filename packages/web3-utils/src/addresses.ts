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
    tbb: '0xB3C9f63540fbE8b15b06D74fC01AB9224E9C49A2',
    tbs: '0xf5794a6122D15055E346831Ca36a9f01c566549C',
    tbg: '0xa7559c3724fE924E55F4b9177bB0c6baF4cf5D70',
  },
};

export const tokenStakerAddresses: StakersAddresses = {
  421614: {
    tbb: '0xf929dA1CA446190256743C5643440A0aA06A8409',
    tbs: '0xBFc87C48c58F296086ADEA0a02A3b2fa7e67f49A',
    tbg: '0x92feB2324A309e7D0291bE947ba8D0B7903c902C',
  },
};

export const boosterAddresses: BoosterAddresses = {
  421614: {
    tbb: '0x4AB5Ed506fFE2Ae9Dfa12720A8d959FAd8E1770C',
    tbs: '0x75CEB066718d40F87d27b0B581F4C14E2c6F4e64',
    tbg: '0x6513882CDE350a71e458Cc5e58281ccA55B7cB60',
  },
};

export const tokenDistributor: TokenDistributorAddress = {
  42161: '0x70520d9BF8FE4E9eE4aCEaE6168B629961AF0A11',
  421614: '0x7F80B08dDCE1737a6957C279d33EfAFCB354912C',
};

export const rewardSplitter: RewardSplitterAddress = {
  42161: '0xbBBbE9b62Cab1852461D4137b10E959F5577e5BE',
  421614: '0xd5ff24dEE84C7AB7359AD26A48c64F93640dEd0b',
};

export const farmingSplitter: NetworkAddresses = {
  421614: '0x15b8ad7979Ab55c88CA691357661Cd5EA900A4cc',
};

export const stakingSplitter: NetworkAddresses = {
  421614: '0xce0B9FC627897A13757b38a4d2c3174C6e57Be6a',
};

export const boostingSplitter: NetworkAddresses = {
  421614: '0xCc788444876eb1800a58B9f4a7A3E46E4860EB52',
};

export const teamSplitter: NetworkAddresses = {
  421614: '0x3533795C5570d1dF15554d10895E7F57Ec8a5A43',
};
