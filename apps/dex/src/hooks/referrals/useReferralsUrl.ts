import { useQuery } from '@tanstack/react-query';
import { EthereumAddress } from '@lira-dao/web3-utils';


const fetchReferralsUrl = async (address?: EthereumAddress): Promise<any> => {
  if (!address) {
    return '';
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API}/referrals/${address}` || '');

    if (!response.ok) {
      return '';
    }

    const result: { 
      firstLevelCount: number;
      secondLevelCount: number;
      thirdLevelCount: number;
      status: string
    } = await response.json();

    return result;
  } catch (err) {
    return '';
  }
};

export function useReferralsUrl(address?: EthereumAddress) {
  return useQuery({
    queryKey: ['referrals-url', address],
    queryFn: () => fetchReferralsUrl(address),
    refetchOnWindowFocus: false,
    enabled: !!address,
    refetchOnMount: false,
  });
}
