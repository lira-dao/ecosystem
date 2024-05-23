import MetaMaskSDK from '@metamask/sdk';
import { Currency } from '../types';
import { addresses, EthereumAddress } from '@lira-dao/web3-utils';
import { useDexPairs } from '../hooks/useDexPairs';


const metamask = new MetaMaskSDK({});
export const ethereum = metamask.getProvider();

export async function addToken(address: EthereumAddress, symbol: string, decimals: number, image: string) {
  try {
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          symbol,
          decimals,
          image,
        },
      },
    });

    if (wasAdded) {
      console.log('Thanks for your interest!');
    } else {
      console.log('Not added, maybe next time?');
    }
  } catch (error) {
    console.log(error);
  }
}

export async function addLiraToken() {
  return addToken(
    '0xC4868aA029ADD5705FA203580669d2175889D615',
    'LIRA',
    8,
    'https://gateway.pinata.cloud/ipfs/QmeDcLiQAZ5VB2s3rzjjMYafU88tVrXLgEsC4Qon7bTaRM',
  );
}

export async function addLiraDaoToken() {
  return addToken(
    '0x62F53E68662B013ea03B7BA6803b624632179eD3',
    'LDT',
    18,
    'https://gateway.pinata.cloud/ipfs/QmQb1SsLMRdgUA1UPP5ZAn1ZryMifvFrKaUQGY1Mqdb3sy',
  );
}

export async function addWethToken() {
  return addToken(
    '0xdF5c1B370C7aE6C86d98A591C4aBe3453656a4b0',
    'WETH',
    18,
    'https://github.com/trustwallet/assets/blob/master/blockchains/arbitrum/assets/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1/logo.png',
  );
}

export const currencies: Currency[] = [{
  address: '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
  chainId: 42161,
  name: 'LIRA DAO Token',
  symbol: 'LDT',
  icon: 'https://gateway.pinata.cloud/ipfs/QmQb1SsLMRdgUA1UPP5ZAn1ZryMifvFrKaUQGY1Mqdb3sy',
  decimals: 18,
}, {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  chainId: 42161,
  name: 'Wrapped Ether',
  symbol: 'WETH',
  icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/arbitrum/assets/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1/logo.png',
  decimals: 18,
}, {
  address: '0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3',
  chainId: 42161,
  name: 'Satoshi LIRA',
  symbol: 'LIRA',
  icon: 'https://gateway.pinata.cloud/ipfs/QmeDcLiQAZ5VB2s3rzjjMYafU88tVrXLgEsC4Qon7bTaRM',
  decimals: 8,
}];

export function getCurrencyByAddress(address: EthereumAddress) {
  return currencies.find(c => c.address === address);
}
