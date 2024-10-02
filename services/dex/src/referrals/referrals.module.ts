import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReferralsService } from './referrals.service';
import { ReferralsController } from './referrals.controller';

@Module({
  imports: [HttpModule],
  providers: [ReferralsService],
  controllers: [ReferralsController],
})
export class ReferralsModule {}
