import { Controller, Get, Post, Query, ParseIntPipe } from '@nestjs/common';
import { MonthlyAccessService, MonthlyAccessStatistics } from './monthly-access.service';
import { MonthlyAccess } from './monthly-access.entity';

@Controller('monthly-access')
export class MonthlyAccessController {
  constructor(private readonly monthlyAccessService: MonthlyAccessService) {}

  @Post('increase-access')
  async increaseAccess(): Promise<MonthlyAccess> {
    return this.monthlyAccessService.increaseAccessCount();
  }

  @Post('increase-page')
  async increasePage(): Promise<MonthlyAccess> {
    return this.monthlyAccessService.increasePageCount();
  }

  @Get('all')
  async getAllMonthlyData(): Promise<MonthlyAccess[]> {
    return this.monthlyAccessService.getAllMonthlyData();
  }

  @Get('statistics')
  async getStatistics(): Promise<MonthlyAccessStatistics> {
    return this.monthlyAccessService.getStatistics();
  }

  @Get('recent')
  async getRecentMonths(
    @Query('limit', ParseIntPipe) limit: number = 12
  ): Promise<MonthlyAccess[]> {
    return this.monthlyAccessService.getRecentMonths(limit);
  }

  @Get('by-year')
  async getDataByYear(
    @Query('year', ParseIntPipe) year: number
  ): Promise<MonthlyAccess[]> {
    return this.monthlyAccessService.getDataByYear(year);
  }
}