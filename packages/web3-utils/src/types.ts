export type EthereumAddress = `0x${string}`;

export type AddressList = {
  [id: string]: EthereumAddress,
}

export type TokenAddresses = {
  [key: number]: {
    ldt: EthereumAddress,
    lira: EthereumAddress,
    weth: EthereumAddress,
    wbtc: EthereumAddress,
  }
}

export type DexAddresses = {
  [key: number]: {
    factory: EthereumAddress,
    router: EthereumAddress,
  }
}

interface Pair {
  address: EthereumAddress,
  tokens: [EthereumAddress, EthereumAddress],
  symbol: string
}

export type DexPairs = {
  [id: number]: {
    [id: EthereumAddress]: Pair,
  }
}
