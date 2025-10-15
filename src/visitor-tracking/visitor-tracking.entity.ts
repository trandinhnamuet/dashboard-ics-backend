import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'visitor_tracking', schema: 'dashboard' })
export class VisitorTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 1 })
  access_count: number;

  @Column({ type: 'int', default: 1 })
  page_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}