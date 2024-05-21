import { useReadContracts } from 'wagmi';
import { addresses, dexPairV2Abi } from '@lira-dao/web3-utils';

export function useReserves() {
  const result = useReadContracts({
    contracts: [{
      abi: dexPairV2Abi,
      address: addresses.arbitrumSepolia.ldt_weth,
      functionName: 'getReserves',
    }, {
      abi: dexPairV2Abi,
      address: addresses.arbitrumSepolia.ldt_lira,
      functionName: 'getReserves',
    }]
  });

  return result;
}
