import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { User } from 'src/entities/user.entity';
import { PostgresErrorCode } from 'src/helpers/postgresErrorCode.enum';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UtilsService } from 'src/utils/utils.service';
import { UpdateUserPasswordDto } from './dto/updatePassword.dto';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class UsersService extends AbstractService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly utilsService: UtilsService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    super(usersRepository);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findBy({ email: createUserDto.email });
    const [role] = await this.roleRepository.query(`
      SELECT *
      FROM "role"
      WHERE
      role= 'Navaden uporabnik';
      `);
    if (user) {
      throw new BadRequestException('User with that email already exists.');
    }
    try {
      const newUser = this.usersRepository.create({
      role: {id: role.id},
        ...createUserDto });
      return this.usersRepository.save(newUser);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Something went wrong while creating a new user.',
      );
    }
  }

  async getUser(id: string): Promise<User> {
    const dataSql = await this.usersRepository.query(
      `SELECT CONCAT(u.first_name, ' ', u.last_name) AS username, u.avatar, COUNT(q.quote) AS quote, SUM(q.st_glasov) AS st_glasov
            FROM "quote" q
            JOIN "user" u  ON q.user_id = u.id
            WHERE q.user_id = '${id}'
            GROUP BY u.id, u.first_name, u.last_name, u.avatar;
            `,
    );
    return dataSql;
  }

  async getAllUsers() : Promise<User>{
    const dataSql = await this.usersRepository.query(
      `SELECT u.* , r.role
       FROM "user" u JOIN "role" r ON u.role_id = r.id; 
            `,
    );
    return dataSql;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = (await this.findById(id)) as User;
    const { email, password, confirm_password, ...data } = updateUserDto;
    if (user.email !== email && email) {
      user.email = email;
    }
    if (password && confirm_password) {
      if (password !== confirm_password) {
        throw new BadRequestException('Passwords do not match.');
      }
      if (await this.utilsService.compareHash(password, user.password)) {
        throw new BadRequestException(
          'New password cannot be the same as your old password.',
        );
      }
      user.password = await this.utilsService.hash(password);
    }
    try {
      Object.entries(data).map(entry => {
        user[entry[0]] = entry[1];
      });
      return this.usersRepository.save(user);
    } catch (error) {
      console.log(error);
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that email already exists.');
      }
      throw new InternalServerErrorException(
        'Something went wrong while updating the user.',
      );
    }
  }

  async updatePassword(
    id: string,
    updatePassword: UpdateUserPasswordDto,
  ): Promise<User> {
    const user = (await this.findById(id)) as User;
    const {
      current_password,
      password,
      confirm_password,
      ...data
    } = updatePassword;
    if (password && confirm_password) {
      if (password !== confirm_password) {
        throw new BadRequestException('Passwords do not match.');
      }
      if (
        !(await this.utilsService.compareHash(current_password, user.password))
      ) {
        throw new BadRequestException(
          'Current password must be right to change password',
        );
      }
      if (current_password == password) {
        throw new BadRequestException(
          'Password cannot be the same as old password.',
        );
      }
      console.log(password, current_password, confirm_password);
      user.password = await this.utilsService.hash(password);
    }
    try {
      Object.entries(data).map(entry => {
        user[entry[0]] = entry[1];
      });
      return this.usersRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrong while updating the user.',
      );
    }
  }

  async removeUser(id: string, userId: string): Promise<any> {
    const element = await this.findById(id);
    const user = (await this.findById(userId)) as User
    const [role] = await this.roleRepository.query(`
      SELECT id
      FROM "role"
      WHERE
      role= 'Admin';
      `);

      console.log(role)
    try {
      if(user.role = role){
        return this.repository.remove(element);
      }
      else{
        console.log('Nebo šlo saj nisi admin.')
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrong while removing a element.',
      );
    }
  }

  async updateUserImageId(id: string, avatar: string): Promise<User> {
    const user = await this.findById(id);
    return this.update(user.id, { avatar });
  }
}
