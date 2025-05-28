import { Column, DeleteDateColumn, Entity, OneToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from '../../../core/database';
import { Employer, UserRole, BVNData, Nok } from '.';
import { ACCOUNT_TYPE } from '../../../core/constants';
import { Referral } from '../../referral/entities';
import { ContactUs } from '../../contact-us/entities';
import { Media } from '../../media/entities';

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  
  @Column({ nullable: true })
  bvn: string;
  
  @Column({ nullable: true })
  nin: string;

  @Column({ nullable: true })
  pen: string;

  @Column({ name: 'first_name' })
  firstName: string;
  
  @Column({ name: 'middle_name', nullable: true })
  middleName: string;
  
  @Column({ name: 'last_name' })
  lastName: string;
  
  @Column({ unique: true })
  email: string;
  
  @Column({ name: 'dob' })
  dob: string;
  
  @Column({ name: 'gender' })
  gender: string;
  
  @Column({ name: 'phone' })
  phone: string;
  
  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ name: 'uuid_token', nullable: true })
  uuidToken: string;

  @Column({ name: 'ref_code', nullable: true })
  refCode: string;

  @Column({ nullable: true })
  referrer: string;

  @Column({ default: true, name: 'show_balance' })
  showBalance: boolean;

  @Column({ name: 'state_of_posting' })
  stateOfPosting: string;

  @Column({ name: 'lga_of_posting' })
  lgaOfPosting: string;

  @Column({ name: 'is_enabled' })
  isEnabled: boolean;

  @Column({ name: 'is_locked' })
  isLocked: boolean;

  @Column({ name: 'first_login' })
  firstLogin: boolean;
  
  @Column({ name: 'two_factor_auth' })
  twoFactorAuth: boolean;

  @Column({
    name: 'account_type',
    type: 'enum',
    enum: ACCOUNT_TYPE,
    nullable: true
  })
  accountType: ACCOUNT_TYPE;

  @Column({ name: 'otp_code_hash', nullable: true })
  @Exclude()
  otpCodeHash: string;

  @Column({ name: 'otp_code_expiry', type: 'timestamptz', nullable: true })
  otpCodeExpiry: Date | null;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'is_phone_verified', default: false })
  isPhoneVerified: boolean;

  @Column({ name: 'password_changed_at', type: 'timestamptz', nullable: true })
  passwordChangedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => BVNData, bvn => bvn.user)
  bvnData: BVNData;

  @OneToMany(() => Employer, employer => employer.user)
  employers: Employer[];

  @OneToMany(() => ContactUs, contactUs => contactUs.user)
  contactUs: ContactUs[];

  @OneToMany(() => Media, media => media.user)
  media: Media[];

  @OneToMany(() => Nok, nok => nok.user)
  noks: Nok[];

  @OneToMany(() => UserRole, ur => ur.user)
  userRoles: UserRole[];

  @OneToMany(() => Referral, referral => referral.owner)
  referrals: Referral;

  @OneToMany(() => Referral, referral => referral.referrer)
  referred: Referral;

  @Column({ name: 'is_onboarded', default: false })
  isOnboarded: boolean;

  @Column({ name: 'onboarding_date', type: 'timestamptz', nullable: true })
  onboardingDate: Date | null;
}