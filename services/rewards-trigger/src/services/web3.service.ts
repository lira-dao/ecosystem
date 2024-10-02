import { Injectable, Logger } from '@nestjs/common';
import Web3 from 'web3';


@Injectable()
export class Web3Service {
  private readonly logger = new Logger(Web3Service.name);
  private readonly web3: Web3;

  constructor() {
    this.logger.debug('RPC_URL: ' + process.env.RPC_URL);
    this.web3 = new Web3(process.env.RPC_URL);
  }

  getWeb3Instance(): Web3 {
    return this.web3;
  }
}
