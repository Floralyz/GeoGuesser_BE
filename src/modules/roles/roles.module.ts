import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Role } from 'src/entities/role.entity';
import { RolesController } from './roles.controller';


@Module({
    imports: [TypeOrmModule.forFeature([Role]), JwtModule],
    controllers: [RolesController],
    providers: [RolesService],
    exports: [RolesService],
  })
  export class RolesModule {}
