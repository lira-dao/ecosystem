import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { AbiItem, Contract } from 'web3';
import * as schema from '../db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';
import { Web3Provider } from '../services/web3.service';
import * as UniswapV2Pair from '@lira-dao/web3-utils/dist/abi/json/UniswapV2Pair.json';
import * as UniswapV2Router02 from '@lira-dao/web3-utils/dist/abi/json/UniswapV2Router02.json';
import { dexAddress, dexPairs, erc20Abi, tokens } from '@lira-dao/web3-utils';
import BigNumber from 'bignumber.js';

export interface CoinMarketCapPricesResponse {
  data: {
    [key: string]: {
      quote: {
        USD: {
          price: number;
          volume_24h: number;
          market_cap: number;
        };
      };
    };
  };
}

@Injectable()
export class PricesService implements OnModuleInit {
  private readonly logger = new Logger(PricesService.name);

  constructor(
    private readonly web3: Web3Provider,
    private readonly httpService: HttpService,
    @Inject('DB_DEV') private drizzleDev: NodePgDatabase<typeof schema>,
  ) {}

  async onModuleInit() {
    await this.listenToLdtPairEvents();
    await this.listenToLdtWbtcPairEvents();
    await this.listenToLiraPairEvents();
    await this.listenToTbbPairEvents();
    await this.listenToTbsPairEvents();
    await this.listenToTbgPairEvents();
  }

  async listenToLdtPairEvents() {
    const chainId = await this.web3.getChainId();

    const ldtPairAddress = Object.keys(dexPairs[chainId.toString()])[0];

    const contract = new this.web3.socket.eth.Contract(
      UniswapV2Pair.abi,
      ldtPairAddress,
    );

    const router = new this.web3.rpc.eth.Contract(
      UniswapV2Router02.abi,
      dexAddress[chainId.toString()].router,
    );

    contract.events.Swap().on('data', async (data) => {
      this.logger.log('[LdtSwap] data', data, ldtPairAddress);

      const pair = new this.web3.rpc.eth.Contract(
        UniswapV2Pair.abi,
        ldtPairAddress,
      );

      // TODO: remove when token table is present
      const token0 = await pair.methods.token0().call();
      const token1 = await pair.methods.token1().call();

      this.logger.log('[tokens]', {
        token0: token0,
        token1: token1,
      });

      // TODO: decimals
      const amountsOut = await router.methods
        .getAmountsOut(10n ** 18n, [token0, token1])
        .call();

      const ethPrice = await this.drizzleDev
        .select()
        .from(schema.prices)
        .where(eq(schema.prices.symbol, 'ETH'));

      this.logger.log('[ethPrice] ' + ethPrice[0].price);
      this.logger.log('[amountsOut] ' + amountsOut[1]);

      this.logger.log('[price] a', new BigNumber(amountsOut[1]).div(10 ** 18));
      this.logger.log(
        '[price] b',
        new BigNumber(amountsOut[1]).div(10 ** 18).times(ethPrice[0].price),
      );

      const ldtValues = {
        symbol: 'LDT',
        price: new BigNumber(amountsOut[1])
          .div(10 ** 18)
          .times(ethPrice[0].price)
          .toString(),
        volume: '0',
        marketCap: '0',
      };

      this.drizzleDev
        .insert(schema.prices)
        .values(ldtValues)
        .onConflictDoUpdate({
          target: schema.prices.symbol,
          set: ldtValues,
        })
        .then(() => this.logger.debug('updated btc price'))
        .catch((err) => this.logger.error('error updating btc price', err));

      await this.updateLpPrice(ldtPairAddress, pair, chainId);
    });

    contract.events.Swap().on('error', (error) => {
      this.logger.log('[LdtSwap] error', error);
    });

    contract.events.Swap().on('changed', (changed) => {
      this.logger.log('[LdtSwap] changed', changed);
    });

    contract.events.Swap().on('connected', (connected) => {
      this.logger.log('[LdtSwap] connected: ' + connected);
    });
  }

  async listenToLdtWbtcPairEvents() {
    const chainId = await this.web3.getChainId();

    const ldtWbtcPairAddress = Object.keys(dexPairs[chainId.toString()])[2];

    const ldtWbtcPair = new this.web3.socket.eth.Contract(
      UniswapV2Pair.abi,
      ldtWbtcPairAddress,
    );

    ldtWbtcPair.events.Swap().on('data', async (data) => {
      this.logger.log('[LdtWbtcSwap] data', data);
      await this.updateLpPrice(ldtWbtcPairAddress, ldtWbtcPair, chainId);
    });

    ldtWbtcPair.events.Swap().on('error', (error) => {
      this.logger.log('[LdtSwap] error', error);
    });

    ldtWbtcPair.events.Swap().on('changed', (changed) => {
      this.logger.log('[LdtSwap] changed', changed);
    });

    ldtWbtcPair.events.Swap().on('connected', (connected) => {
      this.logger.log('[LdtWbtcSwap] connected: ' + connected);
    });
  }

  async listenToLiraPairEvents() {
    const chainId = await this.web3.getChainId();

    const liraPairAddress = Object.keys(dexPairs[chainId.toString()])[1];

    const liraPair = new this.web3.socket.eth.Contract(
      UniswapV2Pair.abi,
      liraPairAddress,
    );

    const router = new this.web3.rpc.eth.Contract(
      UniswapV2Router02.abi,
      dexAddress[chainId.toString()].router,
    );

    liraPair.events.Swap().on('data', async (data) => {
      this.logger.log('[LiraSwap] data', data);
      const pair = new this.web3.rpc.eth.Contract(
        UniswapV2Pair.abi,
        liraPairAddress,
      );

      // TODO: remove when token table is present
      const token0 = await pair.methods.token0().call();
      const token1 = await pair.methods.token1().call();

      const pairTokens =
        token0 !== tokens[chainId.toString()].ldt
          ? [token0, token1]
          : [token1, token0];

      this.logger.log('[LiraSwap pair]', pair);
      this.logger.log('[LiraSwap pairTokens]', pairTokens);

      // TODO: decimals
      const amountsOut = await router.methods
        .getAmountsOut(10n ** 8n, pairTokens)
        .call();

      const ldtPrice = await this.drizzleDev
        .select()
        .from(schema.prices)
        .where(eq(schema.prices.symbol, 'LDT'));

      this.logger.log('[LiraSwap ethPrice] ' + ldtPrice[0].price);
      this.logger.log('[LiraSwap amountsOut] ' + amountsOut);

      const liraValues = {
        symbol: 'LIRA',
        price: new BigNumber(amountsOut[1])
          .div(10 ** 18)
          .times(ldtPrice[0].price)
          .toString(),
        volume: '0',
        marketCap: '0',
      };

      this.logger.log('[LiraSwap liraValues]', liraValues);
      this.drizzleDev
        .insert(schema.prices)
        .values(liraValues)
        .onConflictDoUpdate({
          target: schema.prices.symbol,
          set: liraValues,
        })
        .then(() => this.logger.debug('updated lira price'))
        .catch((err) => this.logger.error('error updating lira price', err));

      await this.updateLpPrice(liraPairAddress, liraPair, chainId);
    });

    liraPair.events.Swap().on('connected', (connected) => {
      this.logger.log('[LiraSwap] connected: ' + connected);
    });
  }

  async listenToTbbPairEvents() {
    const chainId = await this.web3.getChainId();

    const tbbPairAddress = Object.keys(dexPairs[chainId.toString()])[3];

    const tbbPair = new this.web3.socket.eth.Contract(
      UniswapV2Pair.abi,
      tbbPairAddress,
    );

    const router = new this.web3.rpc.eth.Contract(
      UniswapV2Router02.abi,
      dexAddress[chainId.toString()].router,
    );

    tbbPair.events.Swap().on('data', async (data) => {
      this.logger.log('[TbbSwap] ', data);

      const pair = new this.web3.rpc.eth.Contract(
        UniswapV2Pair.abi,
        tbbPairAddress,
      );

      // TODO: remove when token table is present
      const token0 = await pair.methods.token0().call();
      const token1 = await pair.methods.token1().call();

      const pairTokens =
        token0 !== tokens[chainId.toString()].ldt
          ? [token0, token1]
          : [token1, token0];

      this.logger.log('[TbbSwap pair]', pair);
      this.logger.log('[TbbSwap pairTokens]', pairTokens);

      // TODO: decimals
      const amountsOut = await router.methods
        .getAmountsOut(10n ** 18n, pairTokens)
        .call();

      const ldtPrice = await this.drizzleDev
        .select()
        .from(schema.prices)
        .where(eq(schema.prices.symbol, 'LDT'));

      this.logger.log('[TbbSwap ethPrice] ' + ldtPrice[0].price);
      this.logger.log('[TbbSwap amountsOut] ' + amountsOut);

      const tbbValues = {
        symbol: 'TBb',
        price: new BigNumber(amountsOut[1])
          .div(10 ** 18)
          .times(ldtPrice[0].price)
          .toString(),
        volume: '0',
        marketCap: '0',
      };

      this.logger.log('[TbbSwap tbbValues]', tbbValues);
      this.drizzleDev
        .insert(schema.prices)
        .values(tbbValues)
        .onConflictDoUpdate({
          target: schema.prices.symbol,
          set: tbbValues,
        })
        .then(() => this.logger.debug('updated lira price'))
        .catch((err) => this.logger.error('error updating lira price', err));

      await this.updateLpPrice(tbbPairAddress, tbbPair, chainId);
    });

    tbbPair.events.Swap().on('connected', (connected) => {
      this.logger.log('[TbbSwap] connected: ' + connected);
    });
  }

  async listenToTbsPairEvents() {
    const chainId = await this.web3.getChainId();

    const tbsPairAddress = Object.keys(dexPairs[chainId.toString()])[4];

    const tbsPair = new this.web3.socket.eth.Contract(
      UniswapV2Pair.abi,
      tbsPairAddress,
    );

    const router = new this.web3.rpc.eth.Contract(
      UniswapV2Router02.abi,
      dexAddress[chainId.toString()].router,
    );

    tbsPair.events.Swap().on('data', async (data) => {
      this.logger.log('[TbsSwap] ', data);

      const pair = new this.web3.rpc.eth.Contract(
        UniswapV2Pair.abi,
        tbsPairAddress,
      );

      // TODO: remove when token table is present
      const token0 = await pair.methods.token0().call();
      const token1 = await pair.methods.token1().call();

      const pairTokens =
        token0 !== tokens[chainId.toString()].ldt
          ? [token0, token1]
          : [token1, token0];

      this.logger.log('[TbsSwap pair]', pair);
      this.logger.log('[TbsSwap pairTokens]', pairTokens);

      // TODO: decimals
      const amountsOut = await router.methods
        .getAmountsOut(10n ** 18n, pairTokens)
        .call();

      const ldtPrice = await this.drizzleDev
        .select()
        .from(schema.prices)
        .where(eq(schema.prices.symbol, 'LDT'));

      this.logger.log('[TbsSwap ethPrice] ' + ldtPrice[0].price);
      this.logger.log('[TbsSwap amountsOut] ' + amountsOut);

      const tbsValues = {
        symbol: 'TBs',
        price: new BigNumber(amountsOut[1])
          .div(10 ** 18)
          .times(ldtPrice[0].price)
          .toString(),
        volume: '0',
        marketCap: '0',
      };

      this.logger.log('[TbsSwap tbgValues]', tbsValues);
      this.drizzleDev
        .insert(schema.prices)
        .values(tbsValues)
        .onConflictDoUpdate({
          target: schema.prices.symbol,
          set: tbsValues,
        })
        .then(() => this.logger.debug('updated tbs price'))
        .catch((err) => this.logger.error('error updating tbs price', err));

      await this.updateLpPrice(tbsPairAddress, tbsPair, chainId);
    });

    tbsPair.events.Swap().on('connected', (connected) => {
      this.logger.log('[TbsSwap] connected: ' + connected);
    });
  }

  async listenToTbgPairEvents() {
    const chainId = await this.web3.getChainId();

    const tbgPairAddress = Object.keys(dexPairs[chainId.toString()])[5];

    const tbgPair = new this.web3.socket.eth.Contract(
      UniswapV2Pair.abi,
      tbgPairAddress,
    );

    const router = new this.web3.rpc.eth.Contract(
      UniswapV2Router02.abi,
      dexAddress[chainId.toString()].router,
    );

    tbgPair.events.Swap().on('data', async (data) => {
      this.logger.log('[TbgSwap] ', data);

      const pair = new this.web3.rpc.eth.Contract(
        UniswapV2Pair.abi,
        tbgPairAddress,
      );

      // TODO: remove when token table is present
      const token0 = await pair.methods.token0().call();
      const token1 = await pair.methods.token1().call();

      const pairTokens =
        token0 !== tokens[chainId.toString()].ldt
          ? [token0, token1]
          : [token1, token0];

      this.logger.log('[TbgSwap pair]', pair);
      this.logger.log('[TbgSwap pairTokens]', pairTokens);

      // TODO: decimals
      const amountsOut = await router.methods
        .getAmountsOut(10n ** 18n, pairTokens)
        .call();

      const ldtPrice = await this.drizzleDev
        .select()
        .from(schema.prices)
        .where(eq(schema.prices.symbol, 'LDT'));

      this.logger.log('[TbgSwap ethPrice] ' + ldtPrice[0].price);
      this.logger.log('[TbgSwap amountsOut] ' + amountsOut);

      const tbgValues = {
        symbol: 'TBg',
        price: new BigNumber(amountsOut[1])
          .div(10 ** 18)
          .times(ldtPrice[0].price)
          .toString(),
        volume: '0',
        marketCap: '0',
      };

      this.logger.log('[TbgSwap tbgValues]', tbgValues);
      this.drizzleDev
        .insert(schema.prices)
        .values(tbgValues)
        .onConflictDoUpdate({
          target: schema.prices.symbol,
          set: tbgValues,
        })
        .then(() => this.logger.debug('updated tbg price'))
        .catch((err) => this.logger.error('error updating tbg price', err));

      await this.updateLpPrice(tbgPairAddress, tbgPair, chainId);
    });

    tbgPair.events.Swap().on('connected', (connected) => {
      this.logger.log('[TbgSwap] connected: ' + connected);
    });
  }

  async updateLpPrice(
    lpPairAddress: string,
    lpPairContract: Contract<AbiItem[]>,
    chainId: bigint,
  ) {
    const reserves = await lpPairContract.methods.getReserves().call();
    const reserve0Raw = new BigNumber((reserves as any)._reserve0);
    const reserve1Raw = new BigNumber((reserves as any)._reserve1);

    let token0Address: string | null = null;
    let token1Address: string | null = null;

    try {
      token0Address = await lpPairContract.methods.token0().call();
      token1Address = await lpPairContract.methods.token1().call();
    } catch (error) {
      this.logger.error(
        `Failed to fetch token addresses for LP ${lpPairAddress}: ${error}`,
      );
      return;
    }

    if (
      typeof token0Address !== 'string' ||
      typeof token1Address !== 'string'
    ) {
      this.logger.warn(`Invalid token addresses for LP ${lpPairAddress}`);
      return;
    }

    const token0Symbol = this.findSymbolByAddress(
      token0Address,
      tokens[chainId.toString()],
    );
    const token1Symbol = this.findSymbolByAddress(
      token1Address,
      tokens[chainId.toString()],
    );

    if (!token0Symbol || !token1Symbol) {
      this.logger.warn(
        `Symbols for one or both token addresses not found: ${token0Address}, ${token1Address}`,
      );
      return;
    }

    const token0Decimals = await this.getTokenDecimals(token0Address);
    const token1Decimals = await this.getTokenDecimals(token1Address);

    // TODO: improve with tokens table
    const token0Details = await this.getTokenPriceBySymbol(token0Symbol);
    const token1Details = await this.getTokenPriceBySymbol(token1Symbol);

    if (token0Details.price === 0 || token1Details.price === 0) {
      this.logger.warn(
        `One of the token prices is zero for LP ${lpPairAddress}. Skipping calculation.`,
      );
      return;
    }

    const token0Price = token0Details.price;
    const token1Price = token1Details.price;

    const pairSymbol = this.findPairSymbolByAddress(
      lpPairAddress,
      dexPairs[chainId.toString()],
    );

    if (!pairSymbol) {
      this.logger.warn(
        `Symbol for LP pair address not found: ${lpPairAddress}`,
      );
      return;
    } else {
      console.log(`LP Symbol for ${lpPairAddress} is ${pairSymbol}`);
    }

    const reserve0 = reserve0Raw.div(new BigNumber(10).pow(token0Decimals));
    const reserve1 = reserve1Raw.div(new BigNumber(10).pow(token1Decimals));

    const reserve0Value = reserve0.times(token0Price);
    const reserve1Value = reserve1.times(token1Price);

    const totalValue = reserve0Value.plus(reserve1Value);

    const lpDecimals = Number(await lpPairContract.methods.decimals().call());

    let lpSupplyRaw: BigNumber;
    try {
      lpSupplyRaw = new BigNumber(
        await lpPairContract.methods.totalSupply().call(),
      );
    } catch (error) {
      this.logger.error(`Failed to fetch total supply for LP: ${error}`);
      return new BigNumber(0);
    }

    const lpSupply = lpSupplyRaw.dividedBy(new BigNumber(10).pow(lpDecimals));
    if (lpSupply.isZero()) {
      this.logger.warn('LP Supply is zero. Cannot calculate LP price.');
      return new BigNumber(0);
    }

    const lpPrice = totalValue.div(lpSupply);

    // const token0PerLp = reserve0.div(lpSupply);
    // const token1PerLp = reserve1.div(lpSupply);

    console.log({
      address: lpPairAddress,
      symbol: pairSymbol,
      price: lpPrice.toString(),
      totalValue: totalValue.toString(),
      supply: lpSupply.toString(),
      reserve0: reserve0.toString(),
      reserve1: reserve1.toString(),
      reserve0Value: reserve0Value.toString(),
      reserve1Value: reserve1Value.toString(),
      token0Price: token0Price.toString(),
      token1Price: token1Price.toString(),
      token0perLP: reserve0.div(lpSupply).toString(),
      token1perLP: reserve1.div(lpSupply).toString(),
      updated_at: new Date().toISOString(),
    });

    const lpValues = {
      pairAddress: lpPairAddress,
      symbol: this.findPairSymbolByAddress(
        lpPairAddress,
        dexPairs[chainId.toString()],
      ),
      price: lpPrice.toString(),
      supply: lpSupply.toString(),
    };

    this.drizzleDev
      .insert(schema.lpPrices)
      .values(lpValues)
      .onConflictDoUpdate({
        target: [schema.lpPrices.pairAddress, schema.lpPrices.symbol],
        set: lpValues,
      })
      .then(() => this.logger.debug(`Updated LP prices for ${lpPairAddress}`))
      .catch((err) => this.logger.error('Error updating LP prices', err));
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    this.logger.debug('start updating prices');

    const prices = await this.getCoinMarketCapPrices();

    // handle btc price
    if (prices.data && prices.data['1'].quote) {
      const priceBtc = prices.data['1'].quote.USD;

      const btcValues = {
        symbol: 'BTC',
        price: priceBtc.price.toString(),
        volume: priceBtc.volume_24h.toString(),
        marketCap: priceBtc.market_cap.toString(),
      };

      this.drizzleDev
        .insert(schema.prices)
        .values(btcValues)
        .onConflictDoUpdate({
          target: schema.prices.symbol,
          set: btcValues,
        })
        .then(() => this.logger.debug('updated btc price'))
        .catch((err) => this.logger.error('error updating btc price', err));

      const wbtcValues = {
        symbol: 'WBTC',
        price: priceBtc.price.toString(),
        volume: priceBtc.volume_24h.toString(),
        marketCap: priceBtc.market_cap.toString(),
      };

      this.drizzleDev
        .insert(schema.prices)
        .values(wbtcValues)
        .onConflictDoUpdate({
          target: schema.prices.symbol,
          set: wbtcValues,
        })
        .then(() => this.logger.debug('updated btc price'))
        .catch((err) => this.logger.error('error updating btc price', err));
    }

    // handle eth price
    if (prices.data && prices.data['1027']) {
      const priceEth = prices.data['1027'].quote.USD;

      const ethValues = {
        symbol: 'ETH',
        price: priceEth.price.toString(),
        volume: priceEth.volume_24h.toString(),
        marketCap: priceEth.market_cap.toString(),
      };

      const wethValues = {
        symbol: 'WETH',
        price: priceEth.price.toString(),
        volume: priceEth.volume_24h.toString(),
        marketCap: priceEth.market_cap.toString(),
      };

      this.drizzleDev
        .insert(schema.prices)
        .values(ethValues)
        .onConflictDoUpdate({
          target: schema.prices.symbol,
          set: ethValues,
        })
        .then(() => this.logger.debug('updated eth price'))
        .catch((err) => this.logger.error('error updating eth price', err));

      this.drizzleDev
        .insert(schema.prices)
        .values(wethValues)
        .onConflictDoUpdate({
          target: schema.prices.symbol,
          set: wethValues,
        })
        .then(() => this.logger.debug('updated weth price'))
        .catch((err) => this.logger.error('error updating weth price', err));
    }
  }

  findPairSymbolByAddress(
    pairAddress: string,
    dexPairs: { [pairAddress: string]: { symbol: string } },
  ): string | null {
    if (dexPairs[pairAddress]) {
      return dexPairs[pairAddress].symbol;
    }

    return null;
  }

  findSymbolByAddress(
    address: string,
    tokenMap: { [symbol: string]: string },
  ): string | null {
    for (const symbol in tokenMap) {
      if (tokenMap[symbol] === address) {
        return symbol;
      }
    }
    return null;
  }

  async getTokenDecimals(tokenAddress: string): Promise<number> {
    const tokenContract = new this.web3.rpc.eth.Contract(
      erc20Abi,
      tokenAddress,
    );
    try {
      const decimals = await tokenContract.methods.decimals().call();
      return parseInt(decimals.toString(), 10);
    } catch (error) {
      this.logger.error(
        `Failed to fetch decimals for token ${tokenAddress}: ${error}`,
      );
      return 18;
    }
  }

  async getCoinMarketCapPrices(): Promise<CoinMarketCapPricesResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<CoinMarketCapPricesResponse>(
          'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=1,1027',
          {
            headers: {
              'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }

  async getAllPrices() {
    this.logger.debug('Fetching all prices from db.');

    try {
      const results = await this.drizzleDev
        .select()
        .from(schema.prices)
        .execute();
      return results;
    } catch (error) {
      this.logger.error('Error fetching all prices', error);
      throw new InternalServerErrorException('Error fetching all prices');
    }
  }

  async getAllLpPrices() {
    this.logger.debug('Fetching all LP prices from db.');

    try {
      const results = await this.drizzleDev
        .select()
        .from(schema.lpPrices)
        .execute();
      return results;
    } catch (error) {
      this.logger.error('Error fetching all LP prices', error);
      throw new InternalServerErrorException('Error fetching all LP prices');
    }
  }

  async getTokenPriceBySymbol(
    tokenSymbol: string,
  ): Promise<{ symbol: string; price: number }> {
    const tokenPrice = await this.drizzleDev
      .select()
      .from(schema.prices)
      .where(sql`lower(${schema.prices.symbol}) = ${tokenSymbol.toLowerCase()}`)
      .execute();

    if (tokenPrice.length > 0) {
      const token = tokenPrice[0];

      return {
        symbol: token.symbol,
        price: parseFloat(token.price),
      };
    } else {
      this.logger.warn(`Price for token symbol ${tokenSymbol} not found in DB`);
      return { symbol: tokenSymbol, price: 0 };
    }
  }
}
