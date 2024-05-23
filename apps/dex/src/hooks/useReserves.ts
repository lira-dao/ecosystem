import { useReadContracts } from 'wagmi';
import { dexPairV2Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { useDexPairs } from './useDexPairs';


export function useReserves() {
  const dexPairs = useDexPairs();
  const addresses = Object.keys(dexPairs) as EthereumAddress[];

  return useReadContracts({
    contracts: [{
      abi: dexPairV2Abi,
      address: addresses[0],
      functionName: 'getReserves',
    }]
  });
}
