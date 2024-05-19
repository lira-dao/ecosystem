import { EthereumAddress } from '@lira-dao/web3-utils';


export interface Currency {
  address: EthereumAddress;
  chainId: number;
  name: string
  symbol: string
  icon: string
}
