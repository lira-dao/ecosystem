import {
  BoosterAddresses,
  BoostingStaker,
  BoostingStakers,
  DexAddresses,
  DexPairs,
  FarmingStaker,
  FarmingStakers,
  FarmingStakersAddresses,
  NetworkAddresses,
  RewardSplitterAddress,
  StakersAddresses,
  TokenAddresses,
  TokenDistributorAddress,
  TokenStaker,
  TokenStakers,
} from './types';


export const tokens: TokenAddresses = {
  42161: {
    ldt: '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
    lira: '0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3',

    tbb: '0x9C0385b4F1f3B277ab352B817fC56763081a503c',
    tbs: '0x4bB0Eb07a8ECDcF5f434095Aa34Cc3f69292bcA1',
    tbg: '0xDB0aEb568EfE3598e9A58407c8b52BcFaC2c11e5',

    ltbb: '0x0',
    ltbs: '0x0',
    ltbg: '0x0',

    wbtc: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',

    ldt_tbb: '0xAfb2aaA7b90905f32fDb3E61010F0dc2705827ca',
    ldt_tbs: '0xaFFEBBcbd0DD5AEDeCCdAB84b4103828780fD972',
    ldt_tbg: '0xe24dB13D645218672D4D5Fc15f572328b32946A4',
  },
  421614: {
    ldt: '0x62F53E68662B013ea03B7BA6803b624632179eD3',
    lira: '0xC4868aA029ADD5705FA203580669d2175889D615',

    tbb: '0xb81B1310037Fb2866B267792C2537ced143d3DE8',
    tbs: '0xeE388b955fEb0567Cf86dFAAcdf393aEC14184aa',
    tbg: '0x34597dc215fcfd707c4B9b2D4ba4f69f45A91A82',

    ltbb: '0x3a6B379003ae2edfbe3CF8cdAABf307A747CFA2b',
    ltbs: '0x243C177F2D033336106Bd10181c066bD026A3115',
    ltbg: '0x5932c5A564b8dc8C410A24E02758A2a711f64CE7',

    wbtc: '0xeD26d7763314A722A6A243057Bc76EF67C869D84',
    weth: '0xdF5c1B370C7aE6C86d98A591C4aBe3453656a4b0',

    ldt_tbb: '0x63cB832062De3C0B86aeDdcC41A54AA8DAcae7D6',
    ldt_tbs: '0x58D8C1b01c2B9BFc74B0425f8CA3180b9C70De4C',
    ldt_tbg: '0x7BAbb27A79A3f470bEea87A9008Fc22681F42e2c',
  },
  17000: {
    ldt: '0xECB20AE07a7d8d7e87CF5d06B28620A700aB84F0',
    lira: '0xa3E2dfD82A866537436160EE738335a0EBD00c90',

    tbb: '0x0',
    tbs: '0x0',
    tbg: '0x0',

    ltbb: '0x0',
    ltbs: '0x0',
    ltbg: '0x0',

    wbtc: '0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3',
    weth: '0x335149F2fBe655E6D4243E0e2C19565F10B8b026',

    ldt_tbb: '0x0',
    ldt_tbs: '0x0',
    ldt_tbg: '0x0',
  },
};

export const dexAddress: DexAddresses = {
  42161: {
    factory: '0x33555a27Eb441BcD83CD88052786d5444CAeef1D',
    router: '0x155c88569d76e3648734Ca10b354948AAf8b888F',
  },
  421614: {
    factory: '0x5444060062449bB5cE62f6aDEDCd93A778D89197',
    router: '0xd0a3D92830d673974095824AE5e0177888986F92',
  },
  17000: {
    factory: '0x7aD0E6943265f3A9194BdB38Aed6DC943D16c726',
    router: '0xA005c862C2A34C3A04F1947E644A1377a866eC2d',
  },
};

export const dexPairs: DexPairs = {
  42161: {
    '0xC828F6c8bBF9A90DB6Db9839696ffbF6e06532f9': {
      address: '0xC828F6c8bBF9A90DB6Db9839696ffbF6e06532f9',
      symbol: 'LDT-ETH',
      tokens: [
        '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
        '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      ],
    },
    '0x9F0818aF51fd217A88ccfEf21669979B2570091A': {
      address: '0x9F0818aF51fd217A88ccfEf21669979B2570091A',
      symbol: 'LDT-LIRA',
      tokens: [
        '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
        '0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3',
      ],
    },
    '0x546375EaC8202cB47264519ace589Ca1e9Ef47e9': {
      address: '0x546375EaC8202cB47264519ace589Ca1e9Ef47e9',
      symbol: 'LDT-WBTC',
      tokens: [
        '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
        '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      ],
    },
    '0xAfb2aaA7b90905f32fDb3E61010F0dc2705827ca': {
      address: '0xAfb2aaA7b90905f32fDb3E61010F0dc2705827ca',
      symbol: 'LDT-TBb',
      tokens: [
        '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
        '0x9C0385b4F1f3B277ab352B817fC56763081a503c',
      ],
    },
    '0xaFFEBBcbd0DD5AEDeCCdAB84b4103828780fD972': {
      address: '0xaFFEBBcbd0DD5AEDeCCdAB84b4103828780fD972',
      symbol: 'LDT-TBs',
      tokens: [
        '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
        '0x4bB0Eb07a8ECDcF5f434095Aa34Cc3f69292bcA1',
      ],
    },
    '0xe24dB13D645218672D4D5Fc15f572328b32946A4': {
      address: '0xe24dB13D645218672D4D5Fc15f572328b32946A4',
      symbol: 'LDT-TBg',
      tokens: [
        '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
        '0xDB0aEb568EfE3598e9A58407c8b52BcFaC2c11e5',
      ],
    },
  },
  421614: {
    '0xd31fB87E4755758F4B6501c1024880a031c829Af': {
      address: '0xd31fB87E4755758F4B6501c1024880a031c829Af',
      symbol: 'LDT-ETH',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0xdF5c1B370C7aE6C86d98A591C4aBe3453656a4b0',
      ],
    },
    '0x4990A0b1a81A90F28284090a592a24Ee1F8A1717': {
      address: '0x4990A0b1a81A90F28284090a592a24Ee1F8A1717',
      symbol: 'LDT-LIRA',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0xC4868aA029ADD5705FA203580669d2175889D615',
      ],
    },
    '0x7881Dd52269501468FF8a0b84915633Ea473D832': {
      address: '0x7881Dd52269501468FF8a0b84915633Ea473D832',
      symbol: 'LDT-WBTC',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0xeD26d7763314A722A6A243057Bc76EF67C869D84',
      ],
    },
    // '0x08fF368019Fa4Ed537621732Cc74e3f772B8C199': {
    //   address: '0x08fF368019Fa4Ed537621732Cc74e3f772B8C199',
    //   symbol: 'ETH-WBTC',
    //   tokens: [
    //     '0xeD26d7763314A722A6A243057Bc76EF67C869D84',
    //     '0xdF5c1B370C7aE6C86d98A591C4aBe3453656a4b0',
    //   ],
    // },
    '0x63cB832062De3C0B86aeDdcC41A54AA8DAcae7D6': {
      address: '0x63cB832062De3C0B86aeDdcC41A54AA8DAcae7D6',
      symbol: 'LDT-TBb',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0xb81B1310037Fb2866B267792C2537ced143d3DE8',
      ],
    },
    '0x58D8C1b01c2B9BFc74B0425f8CA3180b9C70De4C': {
      address: '0x58D8C1b01c2B9BFc74B0425f8CA3180b9C70De4C',
      symbol: 'LDT-TBs',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0xeE388b955fEb0567Cf86dFAAcdf393aEC14184aa',
      ],
    },
    '0x7BAbb27A79A3f470bEea87A9008Fc22681F42e2c': {
      address: '0x7BAbb27A79A3f470bEea87A9008Fc22681F42e2c',
      symbol: 'LDT-TBg',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0x34597dc215fcfd707c4B9b2D4ba4f69f45A91A82',
      ],
    },
  },
  17000: {
    '0xc306A71E151Bb11c1cF5c97dCCA5991c05864797': {
      address: '0xc306A71E151Bb11c1cF5c97dCCA5991c05864797',
      symbol: 'LDT-ETH',
      tokens: [
        '0xECB20AE07a7d8d7e87CF5d06B28620A700aB84F0',
        '0x335149F2fBe655E6D4243E0e2C19565F10B8b026',
      ],
    },
  },
};

export const farmingStakersArbitrumSepolia: FarmingStaker[] = [{
  address: '0xe9a072f85629D2bC5F0C0eD0ba591496A9a693C2',
  pool: '0x63cB832062De3C0B86aeDdcC41A54AA8DAcae7D6',
  tokens: [
    '0xb81B1310037Fb2866B267792C2537ced143d3DE8',
    '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  ],
}, {
  address: '0x7c8D044f10f053cDb05783DB1d55B386238dD9De',
  pool: '0x58D8C1b01c2B9BFc74B0425f8CA3180b9C70De4C',
  tokens: [
    '0xeE388b955fEb0567Cf86dFAAcdf393aEC14184aa',
    '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  ],
}, {
  address: '0xcFeC968917c3633578c0bcE2Cac7A7C020CC92cC',
  pool: '0x7BAbb27A79A3f470bEea87A9008Fc22681F42e2c',
  tokens: [
    '0x34597dc215fcfd707c4B9b2D4ba4f69f45A91A82',
    '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  ],
}];

export const farmingStakersArbitrumOne: FarmingStaker[] = [{
  address: '0x7aFfdD28D244FeBfB4A6e8db14D5aA42AB8396Ce',
  pool: '0xAfb2aaA7b90905f32fDb3E61010F0dc2705827ca',
  tokens: [
    '0x9C0385b4F1f3B277ab352B817fC56763081a503c',
    '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
  ],
}, {
  address: '0x0a84C2f54E3C7A00eb57922eEDB03440429E123b',
  pool: '0xaFFEBBcbd0DD5AEDeCCdAB84b4103828780fD972',
  tokens: [
    '0x4bB0Eb07a8ECDcF5f434095Aa34Cc3f69292bcA1',
    '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
  ],
}, {
  address: '0xFA8c04138407756dDAe054287df603b3aed39662',
  pool: '0xe24dB13D645218672D4D5Fc15f572328b32946A4',
  tokens: [
    '0xDB0aEb568EfE3598e9A58407c8b52BcFaC2c11e5',
    '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
  ],
}];

export const farmingStakers: FarmingStakers = {
  42161: farmingStakersArbitrumOne,
  421614: farmingStakersArbitrumSepolia,
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

export const tokenStakersArbitrumSepolia: TokenStaker[] = [{
  address: '0x3b966493605F0E4830a494bbFE16359056F935BB',
  token: '0xb81B1310037Fb2866B267792C2537ced143d3DE8',
  tokens: [
    '0xb81B1310037Fb2866B267792C2537ced143d3DE8',
    '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  ],
}, {
  address: '0xa91e98f955F7F6800fF3ae0eBb41cdE4f4343460',
  token: '0xeE388b955fEb0567Cf86dFAAcdf393aEC14184aa',
  tokens: [
    '0xeE388b955fEb0567Cf86dFAAcdf393aEC14184aa',
    '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  ],
}, {
  address: '0x2c1903A7B091cde7Df3fc463918100AE9f5d7571',
  token: '0x34597dc215fcfd707c4B9b2D4ba4f69f45A91A82',
  tokens: [
    '0x34597dc215fcfd707c4B9b2D4ba4f69f45A91A82',
    '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  ],
}];

export const stakerAddresses: StakersAddresses = {
  421614: {
    tbb: '0x3b966493605F0E4830a494bbFE16359056F935BB',
    tbs: '0xa91e98f955F7F6800fF3ae0eBb41cdE4f4343460',
    tbg: '0x2c1903A7B091cde7Df3fc463918100AE9f5d7571',
  },
};

export const tokenStakers: TokenStakers = {
  421614: tokenStakersArbitrumSepolia,
};

export const boostingStakersArbitrumSepolia: BoostingStaker[] = [{
  address: '0x93D74215B2E48eFD09b679eF3c1615DEc1c5D3C4',
  token: '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  staker: '0x3b966493605F0E4830a494bbFE16359056F935BB',
}, {
  address: '0xF1B40B858B0C1448da1939bE344FBE6b1AE01745',
  token: '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  staker: '0xa91e98f955F7F6800fF3ae0eBb41cdE4f4343460',
}, {
  address: '0xf0F9B30864846e363A91929E65999815c484f8E9',
  token: '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  staker: '0x2c1903A7B091cde7Df3fc463918100AE9f5d7571',
}];

export const boostingStakers: BoostingStakers = {
  421614: boostingStakersArbitrumSepolia,
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
