import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SightsService } from './sights.service';
import { UsersService } from '../users/users.service';
import { Public } from 'src/decorators/public.decorator';
import { RequestWithUser } from 'src/interfaces/auth.interface';
import { CreateSightDto } from './dto/create-sight.dto';
import { Sight } from 'src/entities/sight.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdateSightDto } from './dto/update-sight.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'src/helpers/imageStorage';
import { join } from 'path';

@ApiTags('location')
@Controller('location')
@UseInterceptors(ClassSerializerInterceptor)
export class SightsController {
  constructor(
    private readonly sightService: SightsService, //private usersService: UsersService,
  ) {}

  @Post('sight')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async addLocation(
    @Req() request: RequestWithUser,
    @Body() createSightDto: CreateSightDto,
  ) {
    console.log(request.user);
    return this.sightService.createSight(createSightDto, request.user.id);
  }

  @Get('recent')
  @HttpCode(HttpStatus.OK)
  async getAllLocations(@Query('limit') limit = 9): Promise<Sight> {
    return this.sightService.getRecentSights(limit);
  }

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

  @Get('/profile/:id')
  @HttpCode(HttpStatus.OK)
  async getUserSights(
    @Param('id') id: string,
    @Query('limit') limit = 9,
  ): Promise<Sight> {
    return this.sightService.getUserSights(id, limit);
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async removeSight(@Param('id') id: string): Promise<Sight> {
    return this.sightService.remove(id);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('image', saveImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(@UploadedFile() file: Express.Multer.File, @Param('id') sightId: string): Promise<Sight> {
    const filename = file?.filename

    if (!filename) throw new BadRequestException('File must be a png, jpg/jpeg')

    const imagesFolderPath = join(process.cwd(), 'files')
    const fullImagePath = join(imagesFolderPath + '/' + file.filename)
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.sightService.updateSightImage(sightId, filename)
    }
    removeFile(fullImagePath)
    throw new BadRequestException('File content does not match extension!')
  }

  @Post('remove/:id')
  @HttpCode(HttpStatus.OK)
  async removeQuote(@Param('id') id: string): Promise<Sight> {
    return this.sightService.remove(id);
  }
}
