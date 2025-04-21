import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BVNData } from './bvnData.entity';
import { Employer } from './employer.entity';
import { Nok } from './nok.entity';
import { UserRole } from './userRole.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column()
  email: string;

  @Column()
  dob: string;

  @Column()
  gender: string;

  @Column()
  phone: string;

  @Column()
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

  @OneToMany(() => BVNData, bvn => bvn.user)
  bvnData: BVNData[];

  @OneToMany(() => Employer, employer => employer.user)
  employers: Employer[];

  @OneToMany(() => Nok, nok => nok.user)
  noks: Nok[];

  @OneToMany(() => UserRole, ur => ur.user)
  userRoles: UserRole[];
}