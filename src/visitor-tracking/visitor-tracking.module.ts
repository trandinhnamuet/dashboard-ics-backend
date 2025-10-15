import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorTrackingController } from './visitor-tracking.controller';
import { VisitorTrackingService } from './visitor-tracking.service';
import { VisitorTracking } from './visitor-tracking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VisitorTracking])],
  controllers: [VisitorTrackingController],
  providers: [VisitorTrackingService],
  exports: [VisitorTrackingService],
})
export class VisitorTrackingModule {}