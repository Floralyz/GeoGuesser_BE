import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService extends AbstractService{
constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
){
    super(roleRepository)
}

async createRole( createRole: CreateRoleDto): Promise<Role>{
    const role = await this.findBy({ role: createRole.role });
    if (role) {
      throw new BadRequestException('Isti role že obstaja');
    }

    try {
        const newRole = this.roleRepository.create({ ...createRole });
        return this.roleRepository.save(newRole);
      } catch (error) {
        console.log(error);
        throw new BadRequestException(
          'Something went wrong while creating a new role.',
        );
      }
    }
}
