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
    tbb: '0xdBC93d19b699B4f0FaB3aF7bfb56Af6C4BF9fE81',
    tbs: '0x33D784cA9d5ECb9011397ae67544Aa3948D5F679',
    tbg: '0x9786823b18a6E57e76960621bfe0DCA0f0d02508',
  },
};

export const tokenDistributor: TokenDistributorAddress = {
  42161: '0x70520d9BF8FE4E9eE4aCEaE6168B629961AF0A11',
  421614: '0x7F80B08dDCE1737a6957C279d33EfAFCB354912C',
};

export const rewardSplitter: RewardSplitterAddress = {
  42161: '0xbBBbE9b62Cab1852461D4137b10E959F5577e5BE',
  421614: '0x806992260d33cc1673861D55f2259bA33f1Cb0B3',
};

export const farmingSplitter: NetworkAddresses = {
  421614: '0xFfAdA101b22203d22054cD7bb68E2E8170d9cD37',
};

export const stakingSplitter: NetworkAddresses = {
  421614: '0x83F00777Ca33F51691eaD68943E9D84A4a946C23',
};

export const boostingSplitter: NetworkAddresses = {
  421614: '0xF143aaD99Be66B80C5359CD0F1D815De29Ec3A0A',
};

export const teamSplitter: NetworkAddresses = {
  421614: '0x600Bb4586510632aC0351f3a2B980C8cF60b8B9E',
};
