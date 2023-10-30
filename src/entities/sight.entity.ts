import { Column, Double, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Result } from './result.entity';

@Entity()
export class Sight extends Base {
  @Column()
  sight: string

  @ManyToOne(() => User, (user) => user.sights ,{ onDelete: 'CASCADE' })
@JoinColumn({name: 'user_id'})
user: User|string

@OneToMany(() => Result, (result) => result.sight, {eager:true})
  results: Sight[]

  @Column({ type: 'float' })
lat: number;

@Column({ type: 'float' })
lon: number;

@Column()
hint: string;

@Column({nullable: true})
  image: string;

  
}
