import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { Web3Service } from './services/web3.service';
import { AppService } from './app.service';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule.forRoot()],
  controllers: [],
  providers: [Web3Service, AppService],
})
export class AppModule {}
