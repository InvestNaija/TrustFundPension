import {
    Column,
    DeleteDateColumn,
    Entity,
  } from 'typeorm';
  import { Exclude } from 'class-transformer';
  import { AbstractEntity } from '../../../core/database';
  
  @Entity({ name: 'users' })
  export class User extends AbstractEntity {
  
    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ default: false })
    isEmailVerified: boolean;
  
    @Column({ unique: true })
    phoneNumber: string;
  
    @Column({ default: false })
    isPhoneNumberVerified: boolean;
  
    @Column({ nullable: true })
    @Exclude()
    password: string;
  
    @Column({ type: 'timestamptz', nullable: true })
    passwordChangedAt: Date;
  
    @Column({ nullable: true })
    @Exclude()
    otpCodeHash: string;
  
    @Column({ type: 'timestamptz', nullable: true })
    @Exclude()
    otpCodeExpiry: Date;
  
    @Column({ nullable: true })
    profilePictureUrl: string;
  
    @Column({ nullable: true })
    @Exclude()
    ssn: string;
  
    @Column({ nullable: true })
    dateOfBirth: string;
  
    @Column({ nullable: true })
    streetAddress: string;
  
    @Column({ nullable: true })
    city: string;
  
    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    identityProofUrl: string;
  
    @Column({ nullable: true })
    addressProofUrl: string;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deletedAt: Date;
  
  }