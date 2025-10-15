import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VisitorTrackingService } from './visitor-tracking.service';
import { VisitorTracking } from './visitor-tracking.entity';

@Controller('visitor-tracking')
export class VisitorTrackingController {
  constructor(private readonly visitorTrackingService: VisitorTrackingService) {}

  @Post()
  async create(@Body('id') id: string): Promise<VisitorTracking> {
    return this.visitorTrackingService.create(id);
  }

  @Get()
  async findAll(): Promise<VisitorTracking[]> {
    return this.visitorTrackingService.findAll();
  }

  @Get('statistics')
  async getStatistics(): Promise<{ totalPageCount: number; totalAccessCount: number }> {
    return this.visitorTrackingService.getStatistics();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<VisitorTracking> {
    return this.visitorTrackingService.findOne(id);
  }

  @Put(':id/increment-page')
  @HttpCode(HttpStatus.OK)
  async incrementPageCount(@Param('id') id: string): Promise<VisitorTracking> {
    return this.visitorTrackingService.incrementPageCount(id);
  }

  @Put(':id/increment-access')
  @HttpCode(HttpStatus.OK)
  async incrementAccessCount(@Param('id') id: string): Promise<VisitorTracking> {
    return this.visitorTrackingService.incrementAccessCount(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.visitorTrackingService.remove(id);
  }
}