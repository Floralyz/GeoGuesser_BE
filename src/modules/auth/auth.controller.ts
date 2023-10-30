import { Body, ClassSerializerInterceptor, Controller, Get, Header, HttpCode, HttpStatus, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import  { Request, Response} from 'express'
import { RequestWithUser } from 'src/interfaces/auth.interface';
import { JwtAuthGuard } from './guards/jwt.guard';



import { UsersService } from '../users/users.service';
import { ApiTags } from '@nestjs/swagger/dist/decorators';
import { RegisterUserDto } from './dto/user-register.dto';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private authService: AuthService, private usersService:UsersService) { }

    @Public()
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: RegisterUserDto): Promise<User>{
        return this.authService.register(body)
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Req() req:RequestWithUser, @Res({passthrough: true}) res:Response): Promise<User>{
       const access_token = await this.authService.generateJwt(req.user)
       res.cookie('access_token', access_token, {httpOnly: true})
       return req.user
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @HttpCode(HttpStatus.OK)
    async user(@Req() req:Request){
      const id = await this.authService.getUserId(req)
      return this.usersService.findById(id)
      /*
       const cookie = req.cookies['access_token']
       return this.authService.user(cookie)*/
    }

    @UseGuards(JwtAuthGuard)
    @Post('signout')
    @HttpCode(HttpStatus.OK)
    async signout(@Res({passthrough: true}) res: Response): Promise<{msg: string}>{
      res.clearCookie('access_token')
      console.log('Odjavljen')
      return {msg: 'Odjavljen'}
      
  }

  
  
    }

