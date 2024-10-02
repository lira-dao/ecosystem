import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StakingModule } from './staking/staking.module';
import { ReferralModule } from './referral/referral.module';
import { ReferralsModule } from './referrals/referrals.module';
import { PricesModule } from './prices/prices.module';
import * as schema from './db/schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DrizzlePGModule.register({
      tag: 'DB_DEV',
      pg: {
        connection: 'client',
        config: {
          connectionString: process.env.POSTGRES_URL,
        },
      },
      config: { schema: { ...schema } },
    }),
    ScheduleModule.forRoot(),
    StakingModule,
    ReferralModule,
    ReferralsModule,
    PricesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
