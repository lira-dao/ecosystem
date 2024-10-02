import { Module } from '@nestjs/common';
import { PricesController } from './prices.controller';
import { HttpModule } from '@nestjs/axios';
import { PricesService } from './prices.service';
import { Web3Provider } from '../services/web3.service';

@Module({
  imports: [HttpModule],
  providers: [Web3Provider, PricesService],
  controllers: [PricesController],
})
export class PricesModule {}
