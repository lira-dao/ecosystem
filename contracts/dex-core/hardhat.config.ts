import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

dotenv.config();


const {
  ARBITRUM_DEPLOYER_PRIVATE_KEY = '',
  INFURA_ARBITRUM = '',
  INFURA_ARBITRUM_SEPOLIA = '',
  INFURA_HOLESKY = '',
  ETHERSCAN_ARBITRUM = '',
  ETHERSCAN_MAINNET = '',
  ETHERNAL_API_TOKEN = '',
} = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: '0.5.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    holesky: {
      url: INFURA_HOLESKY,
      accounts: [ARBITRUM_DEPLOYER_PRIVATE_KEY],
    },
    arbitrumSepolia: {
      url: INFURA_ARBITRUM_SEPOLIA,
      accounts: [ARBITRUM_DEPLOYER_PRIVATE_KEY],
    },
    arbitrum: {
      url: INFURA_ARBITRUM,
      accounts: [ARBITRUM_DEPLOYER_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: ETHERSCAN_ARBITRUM,
      arbitrum: ETHERSCAN_ARBITRUM,
      holesky: ETHERSCAN_MAINNET,
    },

    customChains: [{
      network: 'arbitrumSepolia',
      chainId: 421614,
      urls: {
        apiURL: 'https://api-sepolia.arbiscan.io/api',
        browserURL: 'https://sepolia.arbiscan.io',
      },
    }, {
      network: 'arbitrum',
      chainId: 42161,
      urls: {
        apiURL: 'https://api.arbiscan.io/api',
        browserURL: 'https://arbiscan.io',
      },
    }, {
      network: 'holesky',
      chainId: 17000,
      urls: {
        apiURL: 'https://api-holesky.etherscan.io/api',
        browserURL: 'https://holesky.etherscan.io',
      },
    }],
  },
};

export default config;
