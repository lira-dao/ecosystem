export type EthereumAddress = `0x${string}`;


export interface Currency {
  address: EthereumAddress;
  chainId: number;
  decimals: number;
  icon: string;
  isNative: boolean;
  name: string;
  paired: string[];
  symbol: string;
}

export type AddressList = {
  [id: string]: EthereumAddress,
}

export type TokenAddresses = {
  [key: number]: {
    ldt: EthereumAddress,
    lira: EthereumAddress,
    weth: EthereumAddress,
    wbtc: EthereumAddress,
    tbb: EthereumAddress,
    tbs: EthereumAddress,
    tbg: EthereumAddress,
    ltbb: EthereumAddress,
    ltbs: EthereumAddress,
    ltbg: EthereumAddress,
  }
}

export type DexAddresses = {
  [key: number]: {
    factory: EthereumAddress,
    router: EthereumAddress,
  }
}

export interface Pair {
  address: EthereumAddress,
  tokens: [EthereumAddress, EthereumAddress],
  symbol: string
}

export type DexPairs = {
  [id: number]: {
    [id: EthereumAddress]: Pair,
  }
}
