import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { createConfig, http, WagmiProvider } from 'wagmi';
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
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';


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
    arbitrumSepolia,
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
    [arbitrumSepolia.id]: http(),
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
  // includeWalletIds: [
  //   'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  // ],
  allWallets: 'SHOW',
  includeWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    '225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f',
    'f2436c67184f158d1beda5df53298ee84abfc367581e4505134b5bcf5f46697d',
    '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
    '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4',
    '163d2cf19babf05eb8962e9748f9ebe613ed52ebf9c8107c9a0f104bfcf161b3',
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
  ],

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
