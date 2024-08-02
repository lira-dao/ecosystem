import { useQuery } from '@tanstack/react-query';
import { EthereumAddress } from '@lira-dao/web3-utils';


const fetchReferralUrl = async (address?: EthereumAddress): Promise<string> => {
  if (!address) {
    return '';
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API}/referral/${address}` || '');

    if (!response.ok) {
      return '';
    }

    const result: { url: string, status: string } = await response.json();

    return result.url;
  } catch (err) {
    return '';
  }
};

export function useReferralUrl(address?: EthereumAddress) {
  return useQuery({
    queryKey: ['referral-url', address],
    queryFn: () => fetchReferralUrl(address),
    refetchOnWindowFocus: false,
    enabled: !!address,
    refetchOnMount: false,
  });
}
