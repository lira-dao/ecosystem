import { useQuery } from '@tanstack/react-query';

const fetchReferralAddress = async (code?: string): Promise<string> => {
  if (!code) {
    return '';
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API}/referral/code/${code}` || '');

    if (!response.ok) {
      return '';
    }

    const result: { address: string, status: string } = await response.json();

    return result.address;
  } catch (err) {
    return '';
  }
};

export function useReferralAddress(code?: string) {
  return useQuery({
    queryKey: ['referral-address', code],
    queryFn: () => fetchReferralAddress(code),
    refetchOnWindowFocus: false,
    enabled: !!code,
    refetchOnMount: false,
  });
}
