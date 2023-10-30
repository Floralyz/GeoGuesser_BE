import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { JwtType, TokenPayload } from 'src/interfaces/auth.interface';
  
  @Injectable()
  export class UtilsService {
    /**
     * @constructor
     * @param jwtService {@link JwtService}
     * @param configService {@link ConfigService}
     */
    constructor(
      private jwtService: JwtService,
      private configService: ConfigService,
    ) {}
  
    /**
     * Hash string value with bcrypt.
     *
     * @param data string
     * @param salt number (optional) Default: 10
     * @returns Promise<string>
     *
     */
    async hash(value: string, salt = 10) {
      try {
        const generatedSalt = await bcrypt.genSalt(salt);
        return bcrypt.hash(value, generatedSalt);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(
          'Something went wrong while hashing password.',
        );
      }
    }
  
    /**
     * Compare hashes with bcrypt.
     *
     * @param value string | Buffer
     * @param salt string
     * @returns Promise<boolean>
     *
     */
    async compareHash(value: string | Buffer, encryptedValue: string) {
      try {
        return bcrypt.compare(value, encryptedValue);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(
          'Something went wrong while comparing hash.',
        );
      }
    }
  
    /**
     * Generate JWT token based on {@link JwtType}
     *
     * @param userId string
     * @param email string
     * @param type {@link JwtType}
     * @param options { [key: string]: unknown }
     * @returns Promise<string>
     *
     */
    async generateToken(sub: string, name: string, type: JwtType) {
      try {
        const payload: TokenPayload = {
          sub: sub,
          name: name,
          type,
        };
        let token: string;
        switch (type) {
          case 'REFRESH_TOKEN':
            token = await this.jwtService.signAsync(payload, {
              secret: this.configService.get('JWT_REFRESH_SECRET'),
              expiresIn: `${Number(
                this.configService.get('JWT_REFRESH_SECRET_EXPIRES') / 1000,
              )}s`,
            });
            break;
          case 'ACCESS_TOKEN':
            token = await this.jwtService.signAsync(payload, {
              secret: this.configService.get('JWT_SECRET'),
              expiresIn: `${Number(
                this.configService.get('JWT_SECRET_EXPIRES')) / 1000
              }s`,
            });
            break;
          default:
            throw new BadRequestException('Permission denied.');
        }
        return token;
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(
          'Something went wrong while generating a new token.',
        );
      }
    }
  }
  