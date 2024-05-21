import { useChainId } from 'wagmi';
import { dexAddress } from '@lira-dao/web3-utils';


export function useDexAddresses() {
  const chainId = useChainId();

  return dexAddress[chainId];
}
