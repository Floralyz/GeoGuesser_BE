import { Column, CreateDateColumn, Double, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Sight } from './sight.entity';
import { Leaderboard } from './leaderboard';

@Entity()
export class Result extends Base {
  @ManyToOne(
    () => User,
    user => user.sights,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'user_id' })
  user: User | string;

  @ManyToOne(
    () => Sight,
    sight => sight.results,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'sight_id' })
  sight: Sight | string;

  @OneToMany(() => Leaderboard, (leaderboard) => leaderboard.result, {eager:true})
  leaderboards: Leaderboard[]

  @Column({ type: 'numeric', precision: 5, scale: 2 , nullable: true  })
  razlika_km: number;

  @Column('double precision')
  ugot_lat: Double;

  @Column('double precision')
  ugot_lon: Double;

  @CreateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' }) // Use 'date' type and 'CURRENT_DATE' for the default value
  datum: Date;
  
  @Column({nullable: true})
  razlika:string;
}
