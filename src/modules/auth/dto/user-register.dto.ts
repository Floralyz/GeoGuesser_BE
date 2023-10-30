import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class RegisterUserDto {
  @ApiProperty({required: false})
  @IsOptional()
  first_name?: string

  @ApiProperty({required: false})
  @IsOptional()
  last_name?: string

  @ApiProperty({required: true})
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({required: true})
  @IsNotEmpty()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*=`|{}:;!.?"()[\]-]{6,}/,{
      message: 'PASSWORD MUST HAVE AT LEAST ONE NUMBER, LOWER OR UPPER CASE LETTER AND IT HAS TO BE LONGER THAN 5 CHARACTERS.',
  })
  password: string

  @ApiProperty({required: true})
  @IsNotEmpty()
  @Match(RegisterUserDto, (field) => field.password, { message: 'Passwords do not match.'})
  confirm_password: string
}
