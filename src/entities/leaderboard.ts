import {
  Column,
  CreateDateColumn,
  Double,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Sight } from './sight.entity';
import { Result } from './result.entity';

@Entity()
export class Leaderboard extends Base {
  @ManyToOne(
    () => User,
    user => user.leaderboards,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'user_id' })
  user: User | string;

  @ManyToOne(
    () => Result,
    result => result.leaderboards,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'result_id' })
  result: Result | string;

  @CreateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' }) // Use 'date' type and 'CURRENT_DATE' for the default value
  datum: Date;

  @Column({ nullable: true })
  razlika: string;
}
