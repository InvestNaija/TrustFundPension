import { Entity, Column, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../core/database';
import { Nok } from './nok.entity';
import { Employer } from './employer.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'addresses' })
export class Address extends AbstractEntity {
  @Expose()
  @Column({ name: 'house_number' })
  houseNumber: string;

  @Expose()
  @Column({ name: 'street_name' })
  streetName: string;

  @Expose()
  @Column()
  city: string;

  @Expose()
  @Column()
  state: string;

  @Expose()
  @Column({ name: 'lga_code' })
  lgaCode: string;

  @Expose()
  @Column({ name: 'zip_code' })
  zipCode: string;

  @Expose()
  @Column({ name: 'country_code' })
  countryCode: string;

  @Column({ name: 'common_id' })
  commonId: string;

  @Column({ name: 'common_type' })
  commonType: string;

  @Expose()
  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => Nok, nok => nok.addresses)
  @JoinColumn({ name: 'common_id', referencedColumnName: 'id' })
  nok: Nok;

  @ManyToOne(() => Employer, employer => employer.addresses)
  @JoinColumn({ name: 'common_id', referencedColumnName: 'id' })
  employer: Employer;
} 