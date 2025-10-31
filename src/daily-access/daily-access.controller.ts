import { Controller, Get, Post, Query, Param } from '@nestjs/common';
import { DailyAccessService } from './daily-access.service';
import { DailyAccess } from './daily-access.entity';

@Controller('daily-access')
export class DailyAccessController {
  constructor(private readonly dailyAccessService: DailyAccessService) {}

  @Get('all')
  async getAllDailyData(): Promise<DailyAccess[]> {
    return this.dailyAccessService.getAllDailyData();
  }

  @Get('statistics')
  async getStatistics(): Promise<{
    totalDays: number;
    dailyData: DailyAccess[];
  }> {
    return this.dailyAccessService.getStatistics();
  }

  @Get('recent')
  async getRecentDays(@Query('limit') limit?: string): Promise<DailyAccess[]> {
    const limitNumber = limit ? parseInt(limit, 10) : 30;
    return this.dailyAccessService.getRecentDays(limitNumber);
  }

  @Get('by-month')
  async getDataByMonth(
    @Query('year') year: string,
    @Query('month') month: string,
  ): Promise<DailyAccess[]> {
    const yearNumber = parseInt(year, 10);
    const monthNumber = parseInt(month, 10);
    return this.dailyAccessService.getDataByMonth(yearNumber, monthNumber);
  }

  @Get('by-range')
  async getDataByDateRange(
    @Query('start') startDate: string,
    @Query('end') endDate: string,
  ): Promise<DailyAccess[]> {
    return this.dailyAccessService.getDataByDateRange(startDate, endDate);
  }

  @Get('by-year')
  async getDataByYear(@Query('year') year: string): Promise<DailyAccess[]> {
    const yearNumber = parseInt(year, 10);
    return this.dailyAccessService.getDataByYear(yearNumber);
  }

  @Get('today')
  async getTodayData(): Promise<DailyAccess | null> {
    return this.dailyAccessService.getTodayData();
  }

  @Get('yesterday')
  async getYesterdayData(): Promise<DailyAccess | null> {
    return this.dailyAccessService.getYesterdayData();
  }

  @Post('increment-access')
  async incrementAccessCount(@Query('date') date?: string): Promise<DailyAccess> {
    return this.dailyAccessService.incrementAccessCount(date);
  }

  @Post('increment-page')
  async incrementPageCount(@Query('date') date?: string): Promise<DailyAccess> {
    return this.dailyAccessService.incrementPageCount(date);
  }
}