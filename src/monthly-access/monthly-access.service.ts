import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyAccess } from './monthly-access.entity';

export interface MonthlyAccessStatistics {
  totalMonths: number;
  monthlyData: MonthlyAccess[];
}

@Injectable()
export class MonthlyAccessService {
  constructor(
    @InjectRepository(MonthlyAccess)
    private monthlyAccessRepository: Repository<MonthlyAccess>,
  ) {}

  // Lấy tháng hiện tại theo giờ Việt Nam
  private getCurrentMonth(): string {
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + (7 * 60 * 60 * 1000)); // UTC+7
    const year = vietnamTime.getFullYear();
    const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  // Tăng số lượt truy cập cho tháng hiện tại
  async increaseAccessCount(): Promise<MonthlyAccess> {
    const currentMonth = this.getCurrentMonth();
    
    let monthlyAccess = await this.monthlyAccessRepository.findOne({
      where: { month: currentMonth }
    });

    if (!monthlyAccess) {
      monthlyAccess = this.monthlyAccessRepository.create({
        month: currentMonth,
        access_count: 1,
        page_count: 0
      });
    } else {
      monthlyAccess.access_count += 1;
    }

    return this.monthlyAccessRepository.save(monthlyAccess);
  }

  // Tăng số lượt xem trang cho tháng hiện tại
  async increasePageCount(): Promise<MonthlyAccess> {
    const currentMonth = this.getCurrentMonth();
    
    let monthlyAccess = await this.monthlyAccessRepository.findOne({
      where: { month: currentMonth }
    });

    if (!monthlyAccess) {
      monthlyAccess = this.monthlyAccessRepository.create({
        month: currentMonth,
        access_count: 0,
        page_count: 1
      });
    } else {
      monthlyAccess.page_count += 1;
    }

    return this.monthlyAccessRepository.save(monthlyAccess);
  }

  // Lấy tất cả dữ liệu theo tháng
  async getAllMonthlyData(): Promise<MonthlyAccess[]> {
    return this.monthlyAccessRepository.find({
      order: { month: 'ASC' }
    });
  }

  // Lấy thống kê tổng quan
  async getStatistics(): Promise<MonthlyAccessStatistics> {
    const monthlyData = await this.getAllMonthlyData();
    
    return {
      totalMonths: monthlyData.length,
      monthlyData
    };
  }

  // Lấy dữ liệu theo số tháng gần nhất
  async getRecentMonths(limit: number = 12): Promise<MonthlyAccess[]> {
    return this.monthlyAccessRepository.find({
      order: { month: 'DESC' },
      take: limit
    });
  }

  // Lấy dữ liệu theo năm
  async getDataByYear(year: number): Promise<MonthlyAccess[]> {
    return this.monthlyAccessRepository
      .createQueryBuilder('monthly_access')
      .where('monthly_access.month LIKE :year', { year: `${year}-%` })
      .orderBy('monthly_access.month', 'ASC')
      .getMany();
  }
}