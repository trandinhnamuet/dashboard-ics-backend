import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'monthly_access', schema: 'dashboard' })
export class MonthlyAccess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 7, unique: true }) // YYYY-MM format
  month: string;

  @Column({ type: 'int', default: 0 })
  access_count: number;

  @Column({ type: 'int', default: 0 })
  page_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}