import { useChainId } from 'wagmi';
import { dexPairs } from '@lira-dao/web3-utils';


export function useDexPairs() {
  const chainId = useChainId();

  return dexPairs[chainId];
}
