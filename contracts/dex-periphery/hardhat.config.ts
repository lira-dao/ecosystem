import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { etherscan, networks } from '@lira-dao/hardhat-config';

dotenv.config();


const config: HardhatUserConfig = {
  solidity: {
    version: '0.6.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks,
  etherscan,
};

export default config;
