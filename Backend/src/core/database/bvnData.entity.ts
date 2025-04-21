import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('bvn_data')
export class BVNData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  bvn: string;

  @Column({ type: 'json' })
  bvn_response: any;

  @ManyToOne(() => User, user => user.bvnData)
  user: User;
}