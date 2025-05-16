import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from '../../../core/database';
import { Employer, UserRole, BVNData, Nok } from '.';
import { USER_ROLE } from '../../../core/constants';

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  
  @Column()
  bvn: string;
  
  @Column()
  nin: string;

  @Column()
  rsa_pin: string;

  @Column()
  first_name: string;
  
  @Column()
  middle_name: string;
  
  @Column()
  last_name: string;
  
  @Column({ unique: true })
  email: string;
  
  @Column()
  dob: string;
  
  @Column()
  gender: string;
  
  @Column()
  phone: string;
  
  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column()
  uuid_token: string;

  @Column()
  ref_code: string;

  @Column({ nullable: true })
  referrer: string;

  @Column({ default: false })
  show_balance: boolean;

  @Column()
  state_of_posting: string;

  @Column()
  lga_of_posting: string;

  @Column({ default: true })
  is_enabled: boolean;

  @Column({ default: false })
  is_locked: boolean;

  @Column({ default: true })
  first_login: boolean;
  
  @Column({ default: false })
  two_factor_auth: boolean;

  @Column({ type: 'enum', enum: USER_ROLE })
  role: USER_ROLE;

  @Column({ nullable: true })
  @Exclude()
  otpCodeHash: string;

  @Column({ type: 'timestamptz', nullable: true })
  otpCodeExpiry: Date | null;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  passwordChangedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @OneToMany(() => BVNData, bvn => bvn.user)
  bvnData: BVNData[];

  @OneToMany(() => Employer, employer => employer.user)
  employers: Employer[];

  @OneToMany(() => Nok, nok => nok.user)
  noks: Nok[];

  @OneToMany(() => UserRole, ur => ur.user)
  userRoles: UserRole[];
}