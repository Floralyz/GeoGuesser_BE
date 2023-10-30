import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Exclude } from 'class-transformer';
import { Sight } from './sight.entity';
import { Result } from './result.entity';
import { Leaderboard } from './leaderboard';
import { Role } from './role.entity';

@Entity()
export class User extends Base {
  @Column({ unique: true})
  email: string

  @Column({nullable:true})
  first_name: string

  @Column({nullable:true})
  last_name: string
  
  @Column({nullable: true})
  avatar: string

  @Column({nullable:true})
  @Exclude()
  password: string

  @OneToMany(() => Sight, (sight) => sight.user, {eager:true})
    sights: Sight[]

  @OneToMany(() => Result, (result) => result.user, {eager:true})
    results: Result[]

    @OneToMany(() => Leaderboard, (leaderboard) => leaderboard.user, {eager:true})
    leaderboards: Leaderboard[]

    @ManyToOne(() => Role, (role) => role.users)
@JoinColumn({name: 'role_id'})
role: Role|string

}
