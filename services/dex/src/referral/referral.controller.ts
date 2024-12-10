import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { EthereumAddress } from '@lira-dao/web3-utils';

@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {
  }

  @Get('code/:code')
  async getReferralAddress(
    @Param('code') code: string,
  ): Promise<{ address: string }> {
    const result = await this.referralService.getReferralAddress(code);

    if (result.length !== 1) {
      throw new NotFoundException();
    }

    return result[0];
  }

  @Get(':address')
  async getReferralCode(
    @Param('address') address: EthereumAddress,
  ): Promise<{ code: string }> {
    return {
      code: await this.referralService.getReferralCode(address),
    };
  }
}
