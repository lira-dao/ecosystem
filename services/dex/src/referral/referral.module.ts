import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { Web3Provider } from '../services/web3.service';

@Module({
  imports: [HttpModule],
  providers: [Web3Provider, ReferralService],
  controllers: [ReferralController],
})
export class ReferralModule {}
