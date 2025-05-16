import { Column, Entity, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from '.';
import { AbstractEntity } from 'src/core/database';

@Entity('bvn_data')
export class BVNData extends AbstractEntity{

  @Column()
  userId: string;

  @Column()
  bvn: string;

  @Column({ type: 'json' })
  bvn_response: any;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, user => user.bvnData)
  user: User;
}