import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyAccess } from './daily-access.entity';
import { DailyAccessService } from './daily-access.service';
import { DailyAccessController } from './daily-access.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DailyAccess])],
  providers: [DailyAccessService],
  controllers: [DailyAccessController],
  exports: [DailyAccessService],
})
export class DailyAccessModule {}