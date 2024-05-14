import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import { etherscan, networks } from '@lira-dao/hardhat-config';
import '@nomicfoundation/hardhat-toolbox';

dotenv.config();


const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks,
  etherscan,
};

export default config;
