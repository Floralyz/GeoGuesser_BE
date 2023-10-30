import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { UsersService} from 'src/modules/users/users.service'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { TokenPayload } from 'src/interfaces/auth.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UsersService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: { cookies: Record<string, string> }) => {
          return request?.cookies['access_token']
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  async validate(payload: TokenPayload) {
    return this.userService.findById(payload.sub)
  }
}

