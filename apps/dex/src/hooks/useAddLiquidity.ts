import { useAccount, useBlock, useWriteContract } from 'wagmi';
import { addresses, dexRouterV2Abi } from '@lira-dao/web3-utils';


export function useAddLiquidity(amountA: bigint, amountB: bigint) {
  const account = useAccount();
  const block = useBlock();
  const deadline = (block.data?.timestamp ?? 0n) + 600n

  const { writeContract } = useWriteContract();

  const write = () => {
    if (account.address) {
      writeContract({
        abi: dexRouterV2Abi,
        address: addresses.arbitrumSepolia.router,
        functionName: 'addLiquidity',
        args: [
          addresses.arbitrumSepolia.ldt,
          addresses.arbitrumSepolia.weth,
          amountA,
          amountB,
          amountA - ((amountA * 10n) / 100n),
          amountB - ((amountB * 10n) / 100n),
          account.address,
          deadline,
        ],
      });
    }
  }

  return {
    write,
  };
}
