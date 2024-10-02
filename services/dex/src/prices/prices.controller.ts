import {
  Controller,
  Get,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PricesService } from './prices.service';

@Controller('prices')
export class PricesController {
  private readonly logger = new Logger(PricesController.name);

  constructor(private readonly pricesService: PricesService) {}

  @Get()
  async getAllPrices() {
    try {
      const prices = await this.pricesService.getAllPrices();
      return { status: 'success', data: prices };
    } catch (error) {
      this.logger.error('Failed to retrieve all prices', error);
      throw new HttpException(
        {
          status: 'fail',
          error: 'Failed to retrieve all prices',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/lp')
  async getAllLpPrices() {
    try {
      const lpPrices = await this.pricesService.getAllLpPrices();
      return { status: 'success', data: lpPrices };
    } catch (error) {
      this.logger.error('Failed to retrieve all LP prices', error);
      throw new HttpException(
        {
          status: 'fail',
          error: 'Failed to retrieve all LP prices',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
