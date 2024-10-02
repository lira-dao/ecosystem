import { Controller, Get, Param } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { EthereumAddress } from '@lira-dao/web3-utils';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get(':address')
  async getReferralCounts(@Param('address') address: EthereumAddress): Promise<{
    firstLevelCount: number;
    secondLevelCount: number;
    thirdLevelCount: number;
  }> {
    return await this.referralsService.getReferralsCount(address);
  }
}
