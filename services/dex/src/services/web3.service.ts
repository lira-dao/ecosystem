import { Injectable, Logger } from '@nestjs/common';
import Web3 from 'web3';
import * as process from 'node:process';

@Injectable()
export class Web3Provider {
  private readonly logger = new Logger(Web3Provider.name);
  public readonly rpc: Web3;
  public readonly socket: Web3;
  private chainId: bigint;

  constructor() {
    this.logger.debug('RPC_URL: ' + process.env.RPC_URL);
    this.logger.debug('WS_URL: ' + process.env.WS_URL);

    this.rpc = new Web3(process.env.RPC_URL);
    this.socket = new Web3(process.env.WS_URL);
  }

  async getChainId(): Promise<bigint> {
    if (!this.chainId) {
      this.chainId = await this.rpc.eth.getChainId();
    }

    return this.chainId;
  }
}
