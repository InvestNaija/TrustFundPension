import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from 'src/core/database';
import { User } from 'src/modules/user/entities';
import { UPLOAD_TYPE } from 'src/core/constants';


@Entity('media')
export class Media extends AbstractEntity {

  @ManyToOne(() => User, user => user.media, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  title: string;

  @Column({
    name: 'upload_type',
    type: 'enum',
    enum: UPLOAD_TYPE,
    nullable: false
  })
  upload_type: UPLOAD_TYPE;

  @Column()
  file_url: string;

  @Column()
  file_type: string;

  @Column({ nullable: true })
  file_size: number;

  @Column({ nullable: true })
  tags: string;

} 