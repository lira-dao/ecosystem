export type EthereumAddress = `0x${string}`;
export type AddressList = {
  [name: string]: EthereumAddress,
}
