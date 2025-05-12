import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from 'src/core/database';
import { User } from 'src/modules/user/entities';
import { UPLOAD_TYPE } from 'src/core/constants';


@Entity('media')
export class Media extends AbstractEntity {

  @ManyToOne(() => User, user => user.media, { eager: true })
  user: User;

  @Column({ nullable: true })
  title: string;

  @Column({
    name: 'upload_type',
    type: 'enum',
    enum: UPLOAD_TYPE,
    nullable: false
  })
  uploadType: UPLOAD_TYPE;

  @Column()
  fileUrl: string;

  @Column()
  fileType: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column({ nullable: true })
  tags: string;

} 