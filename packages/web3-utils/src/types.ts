export type EthereumAddress = `0x${string}`;

export type AddressList = {
  [id: string]: EthereumAddress,
}

export type DexAddresses = {
  [key: number]: {
    factory: EthereumAddress,
    router: EthereumAddress,
  }
}
