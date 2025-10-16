import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorTrackingController } from './visitor-tracking.controller';
import { VisitorTrackingService } from './visitor-tracking.service';
import { VisitorTracking } from './visitor-tracking.entity';
import { MonthlyAccessModule } from '../monthly-access/monthly-access.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VisitorTracking]),
    MonthlyAccessModule
  ],
  controllers: [VisitorTrackingController],
  providers: [VisitorTrackingService],
  exports: [VisitorTrackingService],
})
export class VisitorTrackingModule {}