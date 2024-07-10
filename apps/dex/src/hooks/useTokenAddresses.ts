import { useChainId } from 'wagmi';
import { tokens } from '@lira-dao/web3-utils';


export function useTokenAddresses() {
  const chainId = useChainId();

  return tokens[chainId];
}
