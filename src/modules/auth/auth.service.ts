import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import {Request, Response} from 'express'
import { User } from '../../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from 'src/utils/utils.service';
import { CookieType, JwtType, TokenPayload } from 'src/interfaces/auth.interface';
import { PostgresErrorCode } from 'src/helpers/postgresErrorCode.enum';
import { RegisterUserDto } from './dto/user-register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
         private configService: ConfigService,
         private utilsService: UtilsService
        ){}

    async validateUser(email: string, password:string): Promise<User>{
        console.log('Validating user...')
        const user = await this.usersService.findBy({email: email})
        if(!user){
            throw new BadRequestException('Invalid credentials')
        }
        if(!(await this.utilsService.compareHash(password, user.password))){
            throw new BadRequestException('Napačno geslo')
        }

        console.log('Uporabnik obstaja')
        return user
    }

    async register(registerUserDto: RegisterUserDto): Promise<User> {
        const hashedPassword = await this.utilsService.hash(registerUserDto.password)
        return this.usersService.create({
            ...registerUserDto,
            password: hashedPassword,
        })
    }

    async login(userFromRequest: User, res: Response): Promise<void> {
        const {password, ...user} = await this.usersService.findById(userFromRequest.id)
        const accessToken = await this.generateToken(user.id, user.email, JwtType.ACCESS_TOKEN)
        const accessTokenCookie = await this.generateCookie(accessToken, CookieType.ACCESS_TOKEN)
        const refreshToken = await this.generateToken(user.id, user.email, JwtType.REFRESH_TOKEN)
        const refreshTokenCookie = await this.generateCookie(refreshToken, CookieType.REFRESH_TOKEN)
        try {
         await this.updateRtHash(user.id, refreshToken)
         res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]).json({...user})
        } catch (error) {
         console.log(error)
         throw new InternalServerErrorException('Something went wrong while setting cookies into response header')
        }
     }

    async generateJwt(user: User): Promise<string> {
        return this.utilsService.generateToken(user.id,user.email, JwtType.ACCESS_TOKEN)
    }

    async user(cookie: string): Promise<User> {
        const data = await this.jwtService.verifyAsync(cookie)
        return this.usersService.findById(data['id'])
    }
    
    async signout(userId: string, res: Response): Promise<void> {
        const user = await this.usersService.findById(userId)
        await this.usersService.update(user.id, {refresh_token: null})
        try {
            res.setHeader('Set-Cookie', this.getCookiesForSignOut()).sendStatus(200)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException('Something went wrong while setting cookies into response header.')
        }
    }

    async getUserId(request: Request): Promise<string> {
        const user = request.user as User
        return user.id
    }

    async generateToken(userId: string, email: string, type: JwtType): Promise<string> {
        try {
            const payload: TokenPayload = { sub: userId, name: email, type}
            let token:string
            switch(type){
                case JwtType.ACCESS_TOKEN:
                    token = await this.jwtService.signAsync(payload)
                    break
                case JwtType.REFRESH_TOKEN:
                    token = await this.jwtService.signAsync(payload, {
                        secret: this.configService.get('JWT_REFRESH_SECRET'),
                        expiresIn: `${this.configService.get('JWT_REFRESH_SECRET_EXPIRES')}s`,
                    })
                    break
                default:
                    throw new BadRequestException('Permission denied.')
            }
            return token
        } catch (error) {
            console.log(error)
            if(error?.code === PostgresErrorCode.UniqueViolation) {
                throw new BadRequestException('User with that email already exists')
            }
            throw new InternalServerErrorException('Something went wrong while generating a new token.')
        }
    }

    async generateCookie(token: string, type: CookieType): Promise<string> {
        try {
            let cookie:string
            switch(type){
                case CookieType.ACCESS_TOKEN:
                   cookie = `access_token=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
                    'JWT_SECRET_EXPIRES',
                   )}; SameSite=strict`
                    break
                case CookieType.REFRESH_TOKEN:
                    cookie = `refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
                        'JWT_REFRESH_SECRET_EXPIRES',
                       )}; SameSite=strict`
                    break
                default:
                    throw new BadRequestException('ACCESS denied.')
            }
            return cookie
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException('Something went wrong while generating a new cookie.')
        }
    }


    async updateRtHash(userId: string, rt:string): Promise<void>{
        try {
            await this.usersService.update(userId, {refresh_token: rt})
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException('Something went wrong while updating refresh token')
        }
    }
    
    getCookiesForSignOut():string[]{
        return['access_token=; HttpOnly; Path=/; Max-Age=0','refresh_token=; HttpOnly; Path=/; Max-Age=0']
    }
}
