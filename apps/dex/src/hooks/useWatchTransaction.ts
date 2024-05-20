import { useTransactionConfirmations } from 'wagmi';
import { EthereumAddress } from '@lira-dao/web3-utils';
import { useEffect, useState } from 'react';


export function useWatchTransaction(hash?: EthereumAddress) {
  const [isLoading, setIsLoading] = useState(false);

  const confirmations = useTransactionConfirmations({
    hash,
    query: {
      enabled: !!hash && isLoading,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchInterval: 1000,
    },
  });

  useEffect(() => {
    if (!isLoading && hash && !confirmations.data) {
      console.log('start watching');
      setIsLoading(true);
    } else if (isLoading && confirmations && confirmations.data && confirmations.data >= 18n) {
      console.log('stop watching');
      setIsLoading(false);
    }
  }, [isLoading, hash, confirmations]);

  console.log('confirmations', confirmations.data);

  return {
    confirmed: confirmations && confirmations.data && confirmations.data >= 18n,
    isLoading,
  };
}
