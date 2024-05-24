import MetaMaskSDK from '@metamask/sdk';
import { Currency, EthereumAddress, tokens } from '@lira-dao/web3-utils';


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


export const ethereumArbitrumOne: Currency = {
  address: tokens[42161].weth,
  chainId: 42161,
  decimals: 18,
  icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/arbitrum/assets/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1/logo.png',
  isNative: true,
  name: 'Ether',
  symbol: 'ETH',
  paired: [
    'LDT',
  ],
};

export const ethereumArbitrumSepolia: Currency = {
  address: tokens[42161].weth,
  chainId: 42161,
  decimals: 18,
  icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/arbitrum/assets/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1/logo.png',
  isNative: true,
  name: 'Ether',
  symbol: 'ETH',
  paired: [
    'LDT',
  ],
};

export const wethArbitrumSepolia: Currency = {
  address: tokens[421614].weth,
  chainId: 421614,
  name: 'Wrapped Ether',
  symbol: 'WETH',
  icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/arbitrum/assets/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1/logo.png',
  decimals: 18,
  isNative: false,
  paired: [
    'LDT',
  ]
};

export const wethArbitrumOne: Currency = {
  address: tokens[42161].weth,
  chainId: 42161,
  name: 'Wrapped Ether',
  symbol: 'WETH',
  icon: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/arbitrum/assets/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1/logo.png',
  decimals: 18,
  isNative: false,
  paired: [
    'LDT',
  ]
};

export const ldtArbitrumSepolia: Currency = {
  address: tokens[421614].ldt,
  chainId: 421614,
  name: 'LIRA DAO Token',
  symbol: 'LDT',
  icon: 'https://gateway.pinata.cloud/ipfs/QmQb1SsLMRdgUA1UPP5ZAn1ZryMifvFrKaUQGY1Mqdb3sy',
  decimals: 18,
  isNative: false,
  paired: [
    'ETH',
    'WETH',
  ]
};

export const ldtArbitrumOne: Currency = {
  address: tokens[42161].ldt,
  chainId: 42161,
  name: 'LIRA DAO Token',
  symbol: 'LDT',
  icon: 'https://gateway.pinata.cloud/ipfs/QmQb1SsLMRdgUA1UPP5ZAn1ZryMifvFrKaUQGY1Mqdb3sy',
  decimals: 18,
  isNative: false,
  paired: [
    'ETH',
    'WETH',
  ],
};

export const liraArbitrumSepolia: Currency = {
  address: tokens[42161].lira,
  chainId: 42161,
  name: 'Satoshi LIRA',
  symbol: 'LIRA',
  icon: 'https://gateway.pinata.cloud/ipfs/QmeDcLiQAZ5VB2s3rzjjMYafU88tVrXLgEsC4Qon7bTaRM',
  decimals: 8,
  isNative: false,
  paired: [
    'LDT'
  ]
};

export const liraArbitrumOne: Currency = {
  address: tokens[421614].lira,
  chainId: 421614,
  name: 'Satoshi LIRA',
  symbol: 'LIRA',
  icon: 'https://gateway.pinata.cloud/ipfs/QmeDcLiQAZ5VB2s3rzjjMYafU88tVrXLgEsC4Qon7bTaRM',
  decimals: 8,
  isNative: false,
  paired: [
    'LDT',
  ]
};

export const currenciesArbitrumSepolia: Currency[] = [
  ethereumArbitrumSepolia,
  ldtArbitrumSepolia,
  wethArbitrumSepolia,
  // {
  //   ...liraArbitrumSepolia,
  //   paired: [
  //     ldtArbitrumSepolia,
  //   ],
  // },
];

export const currenciesArbitrumOne: Currency[] = [
  ldtArbitrumOne,
  wethArbitrumOne,
  // {
  //   ...liraArbitrumOne,
  //   paired: [
  //     ldtArbitrumOne,
  //   ],
  // },
];

export function getCurrencies(chainId: number) {
  switch (chainId) {
    case 421614:
      return currenciesArbitrumSepolia;
    case 42161:
    default:
      return currenciesArbitrumOne;
  }
}

export function getCurrencyByAddress(address: EthereumAddress) {
  return [...currenciesArbitrumSepolia, ...currenciesArbitrumOne].find(c => c.address === address);
}

export function getPairedCurrencies(chainId: number, currencies: string[]) {
  return getCurrencies(chainId).filter(c => currencies.includes(c.symbol));
}
