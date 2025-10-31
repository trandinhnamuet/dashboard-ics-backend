import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { DailyAccess } from './daily-access.entity';

@Injectable()
export class DailyAccessService {
  constructor(
    @InjectRepository(DailyAccess)
    private dailyAccessRepository: Repository<DailyAccess>,
  ) {}

  async incrementAccessCount(date?: string): Promise<DailyAccess> {
    const targetDate = date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    let dailyAccess = await this.dailyAccessRepository.findOne({
      where: { date: targetDate },
    });

    if (!dailyAccess) {
      dailyAccess = this.dailyAccessRepository.create({
        date: targetDate,
        access_count: 1,
        page_count: 0,
      });
    } else {
      dailyAccess.access_count += 1;
    }

    return this.dailyAccessRepository.save(dailyAccess);
  }

  async incrementPageCount(date?: string): Promise<DailyAccess> {
    const targetDate = date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    let dailyAccess = await this.dailyAccessRepository.findOne({
      where: { date: targetDate },
    });

    if (!dailyAccess) {
      dailyAccess = this.dailyAccessRepository.create({
        date: targetDate,
        access_count: 0,
        page_count: 1,
      });
    } else {
      dailyAccess.page_count += 1;
    }

    return this.dailyAccessRepository.save(dailyAccess);
  }

  async getAllDailyData(): Promise<DailyAccess[]> {
    return this.dailyAccessRepository.find({
      order: { date: 'DESC' },
    });
  }

  async getStatistics(): Promise<{
    totalDays: number;
    dailyData: DailyAccess[];
  }> {
    const dailyData = await this.getAllDailyData();
    return {
      totalDays: dailyData.length,
      dailyData,
    };
  }

  async getRecentDays(limit: number = 30): Promise<DailyAccess[]> {
    return this.dailyAccessRepository.find({
      order: { date: 'DESC' },
      take: limit,
    });
  }

  async getDataByMonth(year: number, month: number): Promise<DailyAccess[]> {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
    
    return this.dailyAccessRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });
  }

  async getDataByDateRange(startDate: string, endDate: string): Promise<DailyAccess[]> {
    return this.dailyAccessRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });
  }

  async getDataByYear(year: number): Promise<DailyAccess[]> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    
    return this.dailyAccessRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });
  }

  async getTodayData(): Promise<DailyAccess | null> {
    const today = new Date().toISOString().split('T')[0];
    return this.dailyAccessRepository.findOne({
      where: { date: today },
    });
  }

  async getYesterdayData(): Promise<DailyAccess | null> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];
    
    return this.dailyAccessRepository.findOne({
      where: { date: yesterdayDate },
    });
  }
}