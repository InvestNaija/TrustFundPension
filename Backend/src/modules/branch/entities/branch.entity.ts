import { AbstractEntity } from 'src/core/database';
import { Entity, Column, DeleteDateColumn } from 'typeorm';

@Entity('branches')
export class Branch extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column({ nullable: true, name: 'full_address' })
  fullAddress: string;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt: Date;
} 