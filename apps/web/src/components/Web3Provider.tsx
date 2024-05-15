import { createWeb3Modal } from '@web3modal/wagmi/react';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { arbitrum, arbitrumSepolia, } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';


const queryClient = new QueryClient();
const projectId = process.env.REACT_APP_WALLECT_CONNECT_PROJECT_ID ?? '';

const metadata = {
  name: 'LIRA DEX',
  description: 'Decentralized Exchange',
  url: process.env.REACT_APP_URL ?? '',
  icons: ['https://liradao.org/android-chrome-384x384.png'],
};

const connectors = [
  walletConnect({ projectId, metadata, showQrModal: false }),
  injected({ shimDisconnect: true }),
  coinbaseWallet({
    appName: metadata.name,
    appLogoUrl: metadata.icons[0],
  }),
];

const mainnetConfig = createConfig({
  chains: [
    arbitrum,
  ],
  transports: {
    [arbitrum.id]: http(),
  },
  connectors,
});

const testnetConfig = createConfig({
  chains: [
    arbitrumSepolia,
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
  connectors,
});

const config = process.env.REACT_APP_TESTNET === 'true'
  ? testnetConfig
  : mainnetConfig;

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: false,
  enableWalletFeatures: false,
  allWallets: 'SHOW',
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
