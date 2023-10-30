import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({required: true})
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({required: true})
  @IsNotEmpty()
  password: string
}
