import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UploadedFile,
  Res,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';
import { User } from 'src/entities/user.entity';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'src/helpers/imageStorage';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/updatePassword.dto';
import { diskStorage } from 'multer';
import { RequestWithUser } from 'src/interfaces/auth.interface';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiCreatedResponse({ description: 'List all users.' })
  @ApiBadRequestResponse({ description: 'Error for list of users.' })
  @Get()
  // @HasPermissions('users')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    return this.userService.paginate(page, ['role']);
  }


  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<User> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @ApiCreatedResponse({ description: 'Creates new user.' })
  @ApiBadRequestResponse({ description: 'Error for creating a new user.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
  
    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('avatar', saveImageToStorage))
    @HttpCode(HttpStatus.CREATED)
    async upload(@UploadedFile() file: Express.Multer.File, @Param('id') id:string): Promise<User> {
        const filename = file?.filename
        console.log('dela')
        if(!filename) throw new BadRequestException('File must be a png, jpg or jpeg')

        const imagesFolderPath = join(process.cwd(), 'files')
        const fullImagePath = join(imagesFolderPath + '/' + file.filename);
        if(await isFileExtensionSafe(fullImagePath)){
            return this.userService.updateUserImageId(id, filename);
        }
        removeFile(fullImagePath);
        throw new BadRequestException('File content does not match extension!');
    }

    @Post('upload')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './files',
        filename(req, file, callback) {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  //upload image
  //json.parse -> when we get the url back.
  uploadFile(@UploadedFile() file) {
    const url = `http://localhost:8000/users/${file.path}`;
    return {
      url: url,
    };
  }

  @Get('files/:path')
  async getImage(@Param('path') path, @Res() res: Response) {
    res.sendFile(path, { root: 'files' });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('me/update_password/:id')
  @HttpCode(HttpStatus.OK)
  async updatePswd(
    @Param('id') id: string,
    @Body() updatePswd: UpdateUserPasswordDto,
  ): Promise<User> {
    return this.userService.updatePassword(id, updatePswd);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string/*, @Req() request:RequestWithUser*/): Promise<User> {
    return this.userService.remove(id/*, request.user.id*/);
  }
}
