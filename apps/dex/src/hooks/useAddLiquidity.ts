import { useAccount, useWriteContract } from 'wagmi';
import { addresses, dexRouterV2Abi } from '@lira-dao/web3-utils';


export function useAddLiquidity(amountA: bigint, amountB: bigint) {
  const account = useAccount();
  const { writeContract, isError, error } = useWriteContract();

  console.log('isError', isError);
  console.log('error', error);

  const write = () => writeContract({
    abi: dexRouterV2Abi,
    address: addresses.arbitrumSepolia.router as `0x${string}`,
    functionName: 'addLiquidity',
    args: [
      addresses.arbitrumSepolia.ldt as `0x${string}`,
      addresses.arbitrumSepolia.weth as `0x${string}`,
      amountA,
      amountB,
      amountA - ((amountA * 10n) / 100n),
      amountB - ((amountB * 10n) / 100n),
      account.address as `0x${string}`,
      9999999999999n,
    ],
  });

  return {
    write,
  };
}
