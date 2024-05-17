import dotenv from 'dotenv';

dotenv.config();

export const networks = {
  holesky: {
    url: process.env.INFURA_HOLESKY || '',
    accounts: [process.env.DEPLOYER_PRIVATE_KEY || ''],
  },
  arbitrumSepolia: {
    url: process.env.INFURA_ARBITRUM_SEPOLIA || '',
    accounts: [process.env.DEPLOYER_PRIVATE_KEY || ''],
  },
  bscTestnet: {
    url: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
    chainId: 97,
    gasPrice: 20000000000,
    accounts: [process.env.DEPLOYER_PRIVATE_KEY || ''],
  },
  bscMainnet: {
    url: 'https://bsc-dataseed.bnbchain.org/',
    chainId: 56,
    gasPrice: 20000000000,
    accounts: [process.env.DEPLOYER_PRIVATE_KEY || ''],
  },
  polygonAmoy: {
    url: process.env.INFURA_POLYGON_AMOY,
    accounts: [process.env.DEPLOYER_PRIVATE_KEY || ''],
  },

  arbitrumOne: {
    url: process.env.INFURA_ARBITRUM,
    accounts: [process.env.DEPLOYER_PRIVATE_KEY],
  }
};

export const arbitrumSepolia = {
  network: 'arbitrumSepolia',
  chainId: 421614,
  urls: {
    apiURL: 'https://api-sepolia.arbiscan.io/api',
    browserURL: 'https://sepolia.arbiscan.io',
  },
};

export const arbitrumOne = {
  network: 'arbitrumOne',
  chainId: 42161,
  urls: {
    apiURL: 'https://api.arbiscan.io/api',
    browserURL: 'https://arbiscan.io',
  },
};

export const holesky = {
  network: 'holesky',
  chainId: 17000,
  urls: {
    apiURL: 'https://api-holesky.etherscan.io/api',
    browserURL: 'https://holesky.etherscan.io',
  },
};

export const polygonAmoy = {
  network: 'polygonAmoy',
  chainId: 80002,
  urls: {
    apiURL: 'https://api.arbiscan.io/api',
    browserURL: 'https://arbiscan.io',
  },
}

export const customChains = [
  arbitrumSepolia,
  arbitrumOne,
  holesky,
  polygonAmoy,
];

export const etherscan = {
  apiKey: {
    arbitrumSepolia: process.env.ETHERSCAN_ARBITRUM || '',
    arbitrumOne: process.env.ETHERSCAN_ARBITRUM || '',
    holesky: process.env.ETHERSCAN_MAINNET || '',
    bscTestnet: process.env.ETHERSCAN_BSC || '',
    bscMainnet: process.env.ETHERSCAN_BSC || '',
  },
  customChains,
}
