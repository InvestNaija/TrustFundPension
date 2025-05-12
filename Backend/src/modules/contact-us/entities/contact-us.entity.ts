import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../core/database';
import { User } from 'src/modules/user/entities';

@Entity('contact_us')
export class ContactUs extends AbstractEntity{

  @ManyToOne(() => User, user => user.contactUs, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  subject: string;

  @Column('text')
  message: string;


  @Column({ nullable: true })
  response: string;

} 