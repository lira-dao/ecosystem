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
    tbb: '0x2f6a5149Ab827c527324DdB82647b2EbBBcdE9bE',
    tbs: '0x533D6bF2C2249e4604f483192e8b21e90400e123',
    tbg: '0xb0BC2754605219F8201b0d5b34fc0340b34057F2',
  },
};

export const tokenStakerAddresses: StakersAddresses = {
  42161: {
    tbb: '0xba93D7107f6F2682aF4135d1989657300A465687',
    tbs: '0x8B7754Bd5a91F4Ca1CC314e089E462B825e5775f',
    tbg: '0x8237D9049F3B55F87f8132b82e66591670a89c53',
  },
  421614: {
    tbb: '0x016393363A48D8319225429eB744EdaeC922f097',
    tbs: '0x1746A0d1d4A1260CDA9Dd865d68fD109A335E19f',
    tbg: '0x09e092b5dC4cE5D3459D865b0bf19a003204df13',
  },
};

export const boosterAddresses: BoosterAddresses = {
  42161: {
    tbb: '0xd5A7399301A850e1F66EFDbf6e2120B0c4671C1b',
    tbs: '0xdC0C9dc2DF304644973224F91c1D65dCe3bba3fc',
    tbg: '0x5Ab512c0207f7852373a04da9B079F27a55254BF',
  },
  421614: {
    tbb: '0xaAfaD1620193FB26A66810638459BB1cCBF6d7FD',
    tbs: '0x3246BB27e990934C65d6DC07C5F5aBCF8C4242AB',
    tbg: '0xB1bBE2154d17d3c7beC11aDB90FAab1Cf38855a0',
  },
};

export const tokenDistributor: TokenDistributorAddress = {
  42161: '0x70520d9BF8FE4E9eE4aCEaE6168B629961AF0A11',
  421614: '0x7F80B08dDCE1737a6957C279d33EfAFCB354912C',
};

export const rewardSplitter: RewardSplitterAddress = {
  42161: '0x457C8820c238aD2aa9e8632479947964b058E4dF',
  421614: '0x248DAFB044173721FbecdC218D676b614467C618',
};

export const farmingSplitter: NetworkAddresses = {
  42161: '0xa7B8062e45519AFEa6D4aBdB77CF47da8cD81230',
  421614: '0x4B54A0823a18F1131a35876fACCA0767eF897eFa',
};

export const stakingSplitter: NetworkAddresses = {
  42161: '0xD3C6e8895bCCF20875a93D05187c249968d717Ee',
  421614: '0x8aEBb2623a5b85F848D2C7c57185d1DbceF283E1',
};

export const boostingSplitter: NetworkAddresses = {
  42161: '0x23C51664EAe50A7594c31790b1562494FA6a6E54',
  421614: '0x4fbEb3702e41ceC4e6a79490A89b6Fc21216e1b3',
};

export const teamSplitter: NetworkAddresses = {
  42161: '0xF0076e130C077DAEE73EF2244260f4051A986671',
  421614: '0x47e626D66F19F8DC3E5376de5b17398fcCdfca8E',
};

export const referrals: NetworkAddresses = {
  421614: '0xCb8ea077FD2511DCF41eA9e7ca108c1f64f682a4',
}
