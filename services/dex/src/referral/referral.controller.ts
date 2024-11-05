import { Controller, Get, Param } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { EthereumAddress } from '@lira-dao/web3-utils';

@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get(':address')
  async getReferralShortLink(
    @Param() params: { address: EthereumAddress },
  ): Promise<{ url: string }> {
    return {
      url: await this.referralService.getShortCode(params.address),
    };
  }
}
