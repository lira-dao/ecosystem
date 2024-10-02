import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as RewardSplitterV2 from '@lira-dao/web3-utils/dist/abi/json/RewardSplitterV2.json';
import { Web3Service } from './services/web3.service';
import { rewardSplitter } from '@lira-dao/web3-utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly web3Service: Web3Service,
    private configService: ConfigService,
  ) {}

  @Cron('0 1 * * *')
  async handleCron() {
    try {
      this.logger.debug('distribute rewards start');

      const web3 = this.web3Service.getWeb3Instance();

      const chainId = await web3.eth.getChainId();
      const rewardSplitterAddress = rewardSplitter[chainId.toString()];

      this.logger.debug('splitter: ' + rewardSplitterAddress);

      const contract = new web3.eth.Contract(
        RewardSplitterV2.abi,
        rewardSplitterAddress,
      );

      const tx = contract.methods.distributeRewards();

      const block = await web3.eth.getBlock();

      const data = {
        from: process.env.WALLET_ADDRESS,
        to: rewardSplitterAddress,
        data: tx.encodeABI(),
        maxFeePerGas: block.baseFeePerGas * 2n,
        maxPriorityFeePerGas: 100000,
      };

      const txSigned = await web3.eth.accounts.signTransaction(
        data,
        process.env.WALLET_PRIVATE_KEY,
      );

      web3.eth
        .sendSignedTransaction(txSigned.rawTransaction)
        .on('sending', (sending) => {
          this.logger.debug('sending: ' + sending);
        })
        .on('sent', (sent) => {
          this.logger.debug('sent: ' + sent);
        })
        .on('transactionHash', (hash) => {
          this.logger.debug('hash: ' + hash);
        })
        .on('error', (error) => {
          this.logger.error('err', error);
        });
    } catch (e) {
      this.logger.error('fatal', e);
    }
  }
}
