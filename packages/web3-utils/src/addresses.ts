import { AddressList, DexAddresses, DexPairs, TokenAddresses } from './types';


export const arbitrumOne: AddressList = {
  lira: '0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3',
  ldt: '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
};

export const arbitrumSepolia: AddressList = {
  // tokens
  lira: '0xC4868aA029ADD5705FA203580669d2175889D615',
  ldt: '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  wbtc: '0xeD26d7763314A722A6A243057Bc76EF67C869D84',
  weth: '0xdF5c1B370C7aE6C86d98A591C4aBe3453656a4b0',

  // dex
  factory: '0xF2B4207ea798ad05DaCFa171AC1BCF2917C71D60',
  router: '0x67aeb185d042b941c1422dd180E460990474858c',

  // pairs
  ldt_weth: '0xA9BA460655E7c2e9F23dA63fe1380dfF734F2864',
  ldt_lira: '0x5Bb070f5aAc461f875992b7e3170eE5cb3281D0D',
};

const holesky: AddressList = {
  ldt: '0xECB20AE07a7d8d7e87CF5d06B28620A700aB84F0',
  wbtc: '0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3',
  weth: '0x335149F2fBe655E6D4243E0e2C19565F10B8b026',
};

export const addresses = {
  arbitrumSepolia,
  holesky,
};

export const tokens: TokenAddresses = {
  421614: {
    ldt: '0x62F53E68662B013ea03B7BA6803b624632179eD3',
    lira: '0xC4868aA029ADD5705FA203580669d2175889D615',
    wbtc: '0xeD26d7763314A722A6A243057Bc76EF67C869D84',
    weth: '0xdF5c1B370C7aE6C86d98A591C4aBe3453656a4b0',
  },
  17000: {
    ldt: '0xECB20AE07a7d8d7e87CF5d06B28620A700aB84F0',
    lira: '0xa3E2dfD82A866537436160EE738335a0EBD00c90',
    wbtc: '0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3',
    weth: '0x335149F2fBe655E6D4243E0e2C19565F10B8b026',
  }
}

export const dexAddress: DexAddresses = {
  421614: {
    factory: '0xa90af4dC8B06Cd8513938554Eec16D95d3425407',
    router: '0xe3533879eA2415D26275211ED06F669b38440737',
  },
  17000: {
    factory: '0x7aD0E6943265f3A9194BdB38Aed6DC943D16c726',
    router: '0xA005c862C2A34C3A04F1947E644A1377a866eC2d',
  }
};

export const dexPairs: DexPairs = {
  421614: {
    '0x059D8A215A076A6E37De9A44F2268dCAE0437C2D': {
      address: '0x059D8A215A076A6E37De9A44F2268dCAE0437C2D',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0xdF5c1B370C7aE6C86d98A591C4aBe3453656a4b0'
      ],
      symbol: 'LDT-WETH'
    },
    '0x5Bb070f5aAc461f875992b7e3170eE5cb3281D0D': {
      address: '0x5Bb070f5aAc461f875992b7e3170eE5cb3281D0D',
      tokens: [
        '0x62F53E68662B013ea03B7BA6803b624632179eD3',
        '0xC4868aA029ADD5705FA203580669d2175889D615'
      ],
      symbol: 'LDT-LIRA'
    }
  },
  17000: {
    '0xc306A71E151Bb11c1cF5c97dCCA5991c05864797': {
      address: '0xc306A71E151Bb11c1cF5c97dCCA5991c05864797',
      tokens: [
        '0xECB20AE07a7d8d7e87CF5d06B28620A700aB84F0',
        '0x335149F2fBe655E6D4243E0e2C19565F10B8b026',
      ],
      symbol: 'LDT-WETH',
    }
  }
}
