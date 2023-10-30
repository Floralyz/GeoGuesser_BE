import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from 'src/interfaces/auth.interface';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@ApiTags('role')
@Controller('role')
@UseInterceptors(ClassSerializerInterceptor)
export class RolesController {
   constructor(
    private readonly roleService: RolesService,
    )
    {}
/*
@UseGuards(JwtAuthGuard)
  @Patch('edit/:id')
  @HttpCode(HttpStatus.OK)
  async updateSight(
    @Param('id') id: string,
    @Body() updateSightDto: UpdateSightDto,
    @Req() request: RequestWithUser,
  ): Promise<Sight> {
    return this.sightService.updateSight(id, updateSightDto, request.user.id);
  }
*/

@Post('add')
@HttpCode(HttpStatus.CREATED)
async createRole (
    @Body() createRoledto: CreateRoleDto
){
    return this.roleService.createRole(createRoledto)
}

}
