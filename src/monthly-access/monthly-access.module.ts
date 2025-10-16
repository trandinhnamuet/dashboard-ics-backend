import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyAccess } from './monthly-access.entity';
import { MonthlyAccessService } from './monthly-access.service';
import { MonthlyAccessController } from './monthly-access.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyAccess])],
  controllers: [MonthlyAccessController],
  providers: [MonthlyAccessService],
  exports: [MonthlyAccessService],
})
export class MonthlyAccessModule {}