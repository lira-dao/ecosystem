import { useQuery } from '@tanstack/react-query';
import { EthereumAddress } from '@lira-dao/web3-utils';


const fetchReferralCode = async (address?: EthereumAddress): Promise<string> => {
  if (!address) {
    return '';
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API}/referral/${address}` || '');

    if (!response.ok) {
      return '';
    }

    const result: { code: string, status: string } = await response.json();

    return result.code;
  } catch (err) {
    return '';
  }
};

export function useReferralCode(address?: EthereumAddress) {
  return useQuery({
    queryKey: ['referral-code', address],
    queryFn: () => fetchReferralCode(address),
    refetchOnWindowFocus: false,
    enabled: !!address,
    refetchOnMount: false,
  });
}
