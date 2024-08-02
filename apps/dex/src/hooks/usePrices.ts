import { useQuery } from '@tanstack/react-query';

export interface PriceResponse {
  status: string;
  data: Price[];
}

export interface Price {
  symbol: string;
  price: string;
  volume: string;
  marketCap: string;
}

const fetchPrices = async (): Promise<Price[]> => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API}/prices` || '');
    if (!response.ok) {
      throw new Error(`Network response was not ok, received status ${response.status}`);
    }

    const result: PriceResponse = await response.json();
    if (result.status !== 'success') {
      throw new Error(`Failed to fetch prices, server returned status: ${result.status}`);
    }

    return result.data;
  } catch (err) {
    console.error('Error fetching prices:', err);
    throw err;
  }
};

export function useFetchPrices() {
  return useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
    refetchOnWindowFocus: false,
  });
}
