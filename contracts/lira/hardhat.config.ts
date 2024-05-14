import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { etherscan, networks } from '@lira-dao/hardhat-config';

dotenv.config();


const config: HardhatUserConfig = {
  solidity: '0.8.16',
  networks,
  etherscan,
};

export default config;
