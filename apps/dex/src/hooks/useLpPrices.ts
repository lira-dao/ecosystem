import { useQuery } from '@tanstack/react-query';

export interface LpPrice {
  pairAddress: string;
  symbol: string;
	supply: string;
  price: string;
	//   totalValue: string;
	//   reserve0: string;
	//   reserve1: string;
	//   token0perLP: string;
	//   token1perLP: string;
}

export interface LpPriceResponse {
  status: string;
  data: LpPrice[];
}

const fetchLpPrices = async (): Promise<LpPrice[]> => {
	try {
		const response = await fetch(`${process.env.REACT_APP_API}/prices/lp` || '');
		if (!response.ok) {
			throw new Error(`Network response was not ok, received status ${response.status}`);
		}

		const result: LpPriceResponse = await response.json();
		if (result.status !== 'success') {
			throw new Error(`Failed to fetch LP prices, server returned status: ${result.status}`);
		}

		return result.data;
	} catch (err) {
		console.error('Error fetching LP prices:', err);
		throw err;
	}
};

export function useFetchLpPrices() {
  const query = useQuery({
    queryKey: ['lpPrices'],
    queryFn: fetchLpPrices,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
}
