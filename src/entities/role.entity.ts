import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Role extends Base {

    @OneToMany(() => User, (users) => users.role, {eager:true})
    users: User[]
    
  @Column({ nullable: true })
  role: string;
}
