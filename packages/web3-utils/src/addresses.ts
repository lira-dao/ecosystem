import { AddressList } from './types';


export const arbitrumOne: AddressList = {
  lira: '0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3',
  ldt: '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
};

export const arbitrumSepolia: AddressList = {
  lira: '0xC4868aA029ADD5705FA203580669d2175889D615',
  ldt: '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  wbtc: '0xeD26d7763314A722A6A243057Bc76EF67C869D84',
  weth: '0xdF5c1B370C7aE6C86d98A591C4aBe3453656a4b0',
  factory: '0xF2B4207ea798ad05DaCFa171AC1BCF2917C71D60',
  router: '0x67aeb185d042b941c1422dd180E460990474858c',
};

const holesky: AddressList = {
  ldt: '0xECB20AE07a7d8d7e87CF5d06B28620A700aB84F0',
};

export const addresses = {
  arbitrumSepolia,
  holesky,
};
