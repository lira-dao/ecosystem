import { DexAddresses, DexPairs, TokenAddresses } from './types';


export const tokens: TokenAddresses = {
  42161: {
    ldt: '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
    lira: '0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3',

    tbb: '0x0',
    tbs: '0x0',
    tbg: '0x0',

    ltbb: '0x0',
    ltbs: '0x0',
    ltbg: '0x0',

    wbtc: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
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
  },
};

export const dexAddress: DexAddresses = {
  42161: {
    factory: '0x33555a27Eb441BcD83CD88052786d5444CAeef1D',
    router: '0x155c88569d76e3648734Ca10b354948AAf8b888F',
  },
  421614: {
    factory: '0xbf26637Cea66313aC4E847aB1A332b0295C966E9',
    router: '0x3988dAE4726588b9Af8F341FECD14bb2d953f900',
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
      symbol: 'LDT-WETH',
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
  },
  421614: {
    '0x8063F3D1C79Cf03f404CA043E3faB3318a5B3648': {
      address: '0x8063F3D1C79Cf03f404CA043E3faB3318a5B3648',
      symbol: 'LDT-WETH',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0xdF5c1B370C7aE6C86d98A591C4aBe3453656a4b0',
      ],
    },
    '0x382D8e8d06efF471A4Ba3C18b22E2f28482f8d66': {
      address: '0x382D8e8d06efF471A4Ba3C18b22E2f28482f8d66',
      symbol: 'LDT-LIRA',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0xC4868aA029ADD5705FA203580669d2175889D615',
      ],
    },
    '0x62aBd928808E4FBdFDd3Aa46219Cf04980473146': {
      address: '0x62aBd928808E4FBdFDd3Aa46219Cf04980473146',
      symbol: 'LDT-WBTC',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0xeD26d7763314A722A6A243057Bc76EF67C869D84',
      ],
    },
    '0x08fF368019Fa4Ed537621732Cc74e3f772B8C199': {
      address: '0x08fF368019Fa4Ed537621732Cc74e3f772B8C199',
      symbol: 'WBTC-WETH',
      tokens: [
        '0xdF5c1B370C7aE6C86d98A591C4aBe3453656a4b0',
        '0xeD26d7763314A722A6A243057Bc76EF67C869D84',
      ]
    }
  },
  17000: {
    '0xc306A71E151Bb11c1cF5c97dCCA5991c05864797': {
      address: '0xc306A71E151Bb11c1cF5c97dCCA5991c05864797',
      symbol: 'LDT-WETH',
      tokens: [
        '0xECB20AE07a7d8d7e87CF5d06B28620A700aB84F0',
        '0x335149F2fBe655E6D4243E0e2C19565F10B8b026',
      ],
    },
  },
};
