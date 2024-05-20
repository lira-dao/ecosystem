import { createWeb3Modal } from '@web3modal/wagmi/react';

import { http, createConfig, WagmiProvider } from 'wagmi';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  bsc,
  bscTestnet,
  holesky,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
} from 'wagmi/chains';
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

const experimentalConfig = createConfig({
  chains: [
    arbitrum,
    mainnet,
    bsc,
    base,
    polygon,
    optimism,
    blast,

    // testnets
    sepolia,
    holesky,
    bscTestnet,
    baseSepolia,
    polygonAmoy,
    optimismSepolia,
    blastSepolia,
  ],
  transports: {
    [arbitrum.id]: http(),
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [blast.id]: http(),

    // testnets
    [sepolia.id]: http(),
    [holesky.id]: http(),
    [bscTestnet.id]: http(),
    [baseSepolia.id]: http(),
    [polygonAmoy.id]: http(),
    [optimismSepolia.id]: http(),
    [blastSepolia.id]: http(),
  },
  connectors,
});

export const wagmiConfig = process.env.REACT_APP_TESTNET === 'true'
  ? testnetConfig
  : process.env.REACT_APP_EXPERIMENTAL === 'true'
    ? experimentalConfig
    : mainnetConfig;

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true,
  enableOnramp: false,
  enableWalletFeatures: false,
  // includeWalletIds: [
  //   'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  // ],
  allWallets: 'SHOW',
  // tokens: {
  //   42161: {
  //     address: '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f',
  //     image: 'https://liradao.org/android-chrome-384x384.png',
  //   },
  //   421614: {
  //     address: '0x62F53E68662B013ea03B7BA6803b624632179eD3',
  //     image: 'https://liradao.org/android-chrome-384x384.png',
  //   },
  // },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
