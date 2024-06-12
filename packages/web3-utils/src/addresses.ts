import { DexAddresses, DexPairs, FarmingStaker, TokenAddresses, TokenDistributorAddress } from './types';


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

    ldt_tbb: '0x0',
    ldt_tbs: '0x0',
    ldt_tbg: '0x0',
  },
  421614: {
    ldt: '0x62F53E68662B013ea03B7BA6803b624632179eD3',
    lira: '0xC4868aA029ADD5705FA203580669d2175889D615',

    tbb: '0xB80C1fA67A59DC863A02cC410196E0DFBD139c73',
    tbs: '0x09F9Ad9B11FFda7470DA7E48A575e172Dda0A759',
    tbg: '0x178a15e434A56d78526FCF4a6748a0482bf043Bb',

    ltbb: '0x3a6B379003ae2edfbe3CF8cdAABf307A747CFA2b',
    ltbs: '0x243C177F2D033336106Bd10181c066bD026A3115',
    ltbg: '0x5932c5A564b8dc8C410A24E02758A2a711f64CE7',

    wbtc: '0xeD26d7763314A722A6A243057Bc76EF67C869D84',
    weth: '0xdF5c1B370C7aE6C86d98A591C4aBe3453656a4b0',

    ldt_tbb: '0xe37D38ea196bfa7877B15f0a4603b4528A318637',
    ldt_tbs: '0xA79B6fab69c6A8DAdC263ABa17046D5A413909eC',
    ldt_tbg: '0xBf59EcBEB30397b44e5fB0F980e22243b1eBCbbc',
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

export const tokenDistributor: TokenDistributorAddress = {
  461614: '0xB367c6955C0953A49Bc15e7D2c4528D39800Ceb0',
}

export const dexAddress: DexAddresses = {
  42161: {
    factory: '0x33555a27Eb441BcD83CD88052786d5444CAeef1D',
    router: '0x155c88569d76e3648734Ca10b354948AAf8b888F',
  },
  421614: {
    factory: '0x3e6F923C47b647a730cDCD8F5B094fA931f9D57d',
    router: '0x0ae8E4F1eEe84E8f7499F383130Cbe9494A36575',
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
    '0xB198D2c850735738c8D8db541292dA6E0Bd290D9': {
      address: '0xB198D2c850735738c8D8db541292dA6E0Bd290D9',
      symbol: 'LDT-ETH',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0xdF5c1B370C7aE6C86d98A591C4aBe3453656a4b0',
      ],
    },
    '0xD4AC7D0ea9C10624572dC1e1bD670Fc14E4485b5': {
      address: '0xD4AC7D0ea9C10624572dC1e1bD670Fc14E4485b5',
      symbol: 'LDT-LIRA',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0xC4868aA029ADD5705FA203580669d2175889D615',
      ],
    },
    '0x7ed19143F09bc1ecFb464B8A36BbCfA5bAe3c660': {
      address: '0x7ed19143F09bc1ecFb464B8A36BbCfA5bAe3c660',
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
    '0xe37D38ea196bfa7877B15f0a4603b4528A318637': {
      address: '0xe37D38ea196bfa7877B15f0a4603b4528A318637',
      symbol: 'LDT-TBb',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0xB80C1fA67A59DC863A02cC410196E0DFBD139c73',
      ],
    },
    '0xA79B6fab69c6A8DAdC263ABa17046D5A413909eC': {
      address: '0xA79B6fab69c6A8DAdC263ABa17046D5A413909eC',
      symbol: 'LDT-TBs',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0x09F9Ad9B11FFda7470DA7E48A575e172Dda0A759',
      ],
    },
    '0xBf59EcBEB30397b44e5fB0F980e22243b1eBCbbc': {
      address: '0xBf59EcBEB30397b44e5fB0F980e22243b1eBCbbc',
      symbol: 'LDT-TBg',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0x178a15e434A56d78526FCF4a6748a0482bf043Bb',
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

export const farmingStakers: FarmingStaker[] = [{
  address: '0xE0F1F09C8D951d121fd8381fEd6CB7bc64f84b2a',
  pool: '0xe37D38ea196bfa7877B15f0a4603b4528A318637',
  tokens: [
    '0xB80C1fA67A59DC863A02cC410196E0DFBD139c73',
    '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  ],
}, {
  address: '0xE77ed8C1B32D4dB071Ed77f215bfF5723EAB252A',
  pool: '0xA79B6fab69c6A8DAdC263ABa17046D5A413909eC',
  tokens: [
    '0x09F9Ad9B11FFda7470DA7E48A575e172Dda0A759',
    '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  ],
}, {
  address: '0x48588346B464874eABE444Bcd0C98DA3Ed36dBb5',
  pool: '0xBf59EcBEB30397b44e5fB0F980e22243b1eBCbbc',
  tokens: [
    '0x178a15e434A56d78526FCF4a6748a0482bf043Bb',
    '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  ],
}];
