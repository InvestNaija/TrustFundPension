import { Entity, Column, DeleteDateColumn } from 'typeorm';
import { AbstractEntity } from 'src/core/database';

@Entity('addresses')
export class Address extends AbstractEntity {
  @Column({ name: 'house_number' })
  houseNumber: string;

  @Column({ name: 'street_name' })
  streetName: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ name: 'lga_code' })
  lgaCode: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column({ name: 'country_code' })
  countryCode: string;

  @Column({ name: 'common_id' })
  commonId: string;

  @Column({ name: 'common_type' })
  commonType: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;
} 