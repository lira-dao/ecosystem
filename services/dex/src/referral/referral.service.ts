import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { count, eq } from 'drizzle-orm';
import { EthereumAddress, referrals } from '@lira-dao/web3-utils';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Web3Provider } from '../services/web3.service';
import * as Referrals from '@lira-dao/web3-utils/dist/abi/json/Referrals.json';

@Injectable()
export class ReferralService implements OnModuleInit {
  private readonly logger = new Logger(ReferralService.name);

  constructor(
    private readonly web3: Web3Provider,
    private readonly httpService: HttpService,
    @Inject('DB_DEV') private drizzleDev: NodePgDatabase<typeof schema>,
  ) {}

  async onModuleInit() {
    await this.sync();
    // await this.listenToReferralRegisteredEvent();
  }

  async sync() {
    this.logger.log('[sync] start');

    const chainId = await this.web3.getChainId();

    const address = referrals[chainId.toString()];

    const contract = new this.web3.rpc.eth.Contract(Referrals.abi, address);

    const endBlock = await this.web3.rpc.eth.getBlockNumber();
    this.logger.log('[sync] latestBlock: ' + endBlock.toString());

    const startBlock = 68487003; // arbitrum sepolia
    // const startBlock = 239685866; // arbitrum one
    const batchSize = 500000 * 8;
    let allEvents = [];
    let currentStartBlock = startBlock;

    while (currentStartBlock <= endBlock) {
      const currentEndBlock = Math.min(
        currentStartBlock + batchSize - 1,
        Number(endBlock),
      );

      this.logger.log(
        `[sync] fetching events from block ${currentStartBlock} to ${currentEndBlock}`,
      );

      try {
        const events = await contract.getPastEvents('allEvents', {
          fromBlock: currentStartBlock,
          toBlock: currentEndBlock,
        });
        allEvents = allEvents.concat(events);
      } catch (error) {
        this.logger.error(
          `Error fetching events from blocks ${currentStartBlock} to ${currentEndBlock}:`,
          error,
        );
      }

      currentStartBlock = currentEndBlock + 1;
    }

    for (const event of allEvents) {
      if (event.event === 'ReferralRegistered') {
        const existingReferral = await this.drizzleDev
          .select()
          .from(schema.referral)
          .where(eq(schema.referral.referral, event.returnValues.referral));

        if (existingReferral.length === 0) {
          this.logger.log(
            `[sync] new referral ${event.returnValues.referrer} - ${event.returnValues.referral}`,
          );

          await this.drizzleDev.insert(schema.referral).values({
            referral: event.returnValues.referral,
            referrer: event.returnValues.referrer,
          });
        } else {
          this.logger.log(
            `[sync] existing referral ${existingReferral[0].referrer} - ${existingReferral[0].referral}`,
          );
        }
      }
    }

    const eventsCount = await this.drizzleDev
      .select({ count: count() })
      .from(schema.referral);

    this.logger.log('[sync] events count: ' + eventsCount[0].count);
    this.logger.log('[sync] end');
  }

  async listenToReferralRegisteredEvent() {
    this.logger.log('[listenToReferralRegisteredEvent] start');

    const chainId = await this.web3.getChainId();

    const address = referrals[chainId.toString()];

    this.logger.log('[listenToReferralRegisteredEvent] address: ' + address);

    const contract = new this.web3.socket.eth.Contract(Referrals.abi, address);

    contract.events.ReferralRegistered().on('data', async (data) => {
      this.logger.log('[listenToReferralRegisteredEvent] data', data);

      if (data.returnValues.referrer && data.returnValues.referral) {
        this.logger.log(
          `[sync] new referral ${data.returnValues.referrer} - ${data.returnValues.referral}`,
        );

        this.logger.debug(typeof data.returnValues.referrer);

        await this.drizzleDev.insert(schema.referral).values({
          referrer: data.returnValues.referrer as string,
          referral: data.returnValues.referral as string,
        });
      }
    });

    contract.events.ReferralRegistered().on('connected', () => {
      this.logger.log('[listenToReferralRegisteredEvent] connected');
    });

    contract.events.ReferralRegistered().on('error', (error) => {
      this.logger.error('[listenToReferralRegisteredEvent] error', { error });
    });
  }

  async getShortUrl(address: EthereumAddress): Promise<string> {
    this.logger.log('request url for ' + address);

    const result = await this.drizzleDev
      .select()
      .from(schema.referralUrl)
      .where(eq(schema.referralUrl.referrer, address));

    console.log('result', result);

    if (result.length === 0) {
      this.logger.log('create new url');

      const { data: newUrl } = await firstValueFrom(
        this.httpService.post<{ code: string; shrtlnk: string }>(
          'https://shrtlnk.dev/api/v2/link',
          {
            url: `${process.env.DEX_URL}/referral/${address}`,
          },
          {
            headers: {
              'api-key': process.env.SHRTLNK_API_KEY,
            },
          },
        ),
      );

      // const newUrl = await axios.post(
      //   'https://shrtlnk.dev/api/v2/link',
      //   {
      //     url: 'referral/' + address,
      //   },
      //   {
      //     headers: {
      //       'api-key': 'C4pxzZp4eYuC86upH3ef91U6sNBbXUkgWnIUstGWBOt5I',
      //     },
      //   },
      // );

      this.logger.log('new url ' + newUrl.shrtlnk);

      await this.drizzleDev
        .insert(schema.referralUrl)
        .values({ referrer: address, url: newUrl.shrtlnk });

      return newUrl.shrtlnk;
    }

    this.logger.log('cached url ' + result[0].url);

    return result[0].url;
  }
}
