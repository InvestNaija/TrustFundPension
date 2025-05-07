import { Column, Entity, DeleteDateColumn, OneToOne } from 'typeorm';
import { User } from '.';
import { AbstractEntity } from 'src/core/database';

@Entity('bvn_data')
export class BVNData extends AbstractEntity{

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  bvn: string;

  @Column({ type: 'json', name: 'bvn_response' })
  bvnResponse: any;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => User, user => user.bvnData)
  user: User;
}