import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { EthereumAddress, treasuryTokenAbi } from '@lira-dao/web3-utils';
import BigNumber from 'bignumber.js';
import { useWatchTransaction } from './useWatchTransaction';


export function useTreasuryToken(address: EthereumAddress, amount: bigint) {
  const account = useAccount();
  const quoteMint = useReadContract({
    abi: treasuryTokenAbi,
    address,
    functionName: 'quoteMint',
    args: [amount],
  });

  const quoteBurn = useReadContract({
    abi: treasuryTokenAbi,
    address,
    functionName: 'quoteBurn',
    args: [amount],
  });

  const mint = useWriteContract();

  const writeMint = () => mint.writeContract({
    abi: treasuryTokenAbi,
    address,
    functionName: 'mint',
    args: [account.address as EthereumAddress, amount],
  });

  const burn = useWriteContract();

  const writeBurn = () => mint.writeContract({
    abi: treasuryTokenAbi,
    address,
    functionName: 'burn',
    args: [amount],
  });

  const mintConfirmed = useWatchTransaction(mint.data);

  const burnConfirmed = useWatchTransaction(burn.data);

  return {
    quoteMint,
    quoteBurn,
    mint: {
      ...mint,
      write: writeMint,
      confirmed: mintConfirmed.confirmed,
      isPending: mint.isPending || mintConfirmed.isLoading,
    },
    burn: {
      ...burn,
      write: writeBurn,
      confirmed: burnConfirmed.confirmed,
      isPending: burn.isPending || burnConfirmed.isLoading,
    },
  };
}
