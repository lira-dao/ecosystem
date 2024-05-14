import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

dotenv.config();


const {
  ARBITRUM_DEPLOYER_PRIVATE_KEY = '',
  INFURA_ARBITRUM = '',
  INFURA_ARBITRUM_SEPOLIA = '',
  INFURA_POLYGON_AMOY = '',
  ETHERSCAN_ARBITRUM = '',
  ETHERNAL_API_TOKEN = '',
} = process.env;

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    arbitrumSepolia: {
      url: INFURA_ARBITRUM_SEPOLIA,
      accounts: [ARBITRUM_DEPLOYER_PRIVATE_KEY],
    },
    arbitrum: {
      url: INFURA_ARBITRUM,
      accounts: [ARBITRUM_DEPLOYER_PRIVATE_KEY],
    },
    polygonAmoy: {
      url: INFURA_POLYGON_AMOY,
      accounts: [ARBITRUM_DEPLOYER_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: ETHERSCAN_ARBITRUM,
      arbitrum: ETHERSCAN_ARBITRUM,
    },

    customChains: [{
      network: 'arbitrumSepolia',
      chainId: 421614,
      urls: {
        apiURL: 'https://api-sepolia.arbiscan.io/api',
        browserURL: 'https://sepolia.arbiscan.io/',
      },
    }, {
      network: 'arbitrum',
      chainId: 42161,
      urls: {
        apiURL: 'https://api.arbiscan.io/api',
        browserURL: 'https://arbiscan.io',
      },
    }, {
      network: 'polygonAmoy',
      chainId: 80002,
      urls: {
        apiURL: 'https://api.arbiscan.io/api',
        browserURL: 'https://arbiscan.io',
      },
    }],
  },
};

export default config;
