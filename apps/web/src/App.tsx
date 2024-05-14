import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { arbitrum, arbitrumSepolia } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


export const config = createConfig({
  chains: [arbitrum, arbitrumSepolia],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
