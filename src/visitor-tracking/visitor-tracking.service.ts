import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitorTracking } from './visitor-tracking.entity';

@Injectable()
export class VisitorTrackingService {
  constructor(
    @InjectRepository(VisitorTracking)
    private visitorTrackingRepository: Repository<VisitorTracking>,
  ) {}

  async create(id: string): Promise<VisitorTracking> {
    const visitor = this.visitorTrackingRepository.create({
      id,
      access_count: 1,
      page_count: 1,
    });
    return this.visitorTrackingRepository.save(visitor);
  }

  async findOne(id: string): Promise<VisitorTracking> {
    const visitor = await this.visitorTrackingRepository.findOne({
      where: { id },
    });
    if (!visitor) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }
    return visitor;
  }

  async incrementPageCount(id: string): Promise<VisitorTracking> {
    const visitor = await this.findOne(id);
    visitor.page_count += 1;
    return this.visitorTrackingRepository.save(visitor);
  }

  async incrementAccessCount(id: string): Promise<VisitorTracking> {
    const visitor = await this.findOne(id);
    visitor.access_count += 1;
    visitor.page_count += 1; // Truy cập trang chủ cũng tăng page count
    return this.visitorTrackingRepository.save(visitor);
  }

  async getStatistics(): Promise<{ totalPageCount: number; totalAccessCount: number }> {
    const result = await this.visitorTrackingRepository
      .createQueryBuilder('visitor')
      .select('SUM(visitor.page_count)', 'totalPageCount')
      .addSelect('SUM(visitor.access_count)', 'totalAccessCount')
      .getRawOne();

    return {
      totalPageCount: parseInt(result.totalPageCount) || 0,
      totalAccessCount: parseInt(result.totalAccessCount) || 0,
    };
  }

  async findAll(): Promise<VisitorTracking[]> {
    return this.visitorTrackingRepository.find();
  }

  async remove(id: string): Promise<void> {
    const visitor = await this.findOne(id);
    await this.visitorTrackingRepository.remove(visitor);
  }
}