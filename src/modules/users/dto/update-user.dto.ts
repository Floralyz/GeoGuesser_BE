import { IsEmail, IsOptional, Matches, ValidateIf } from "class-validator"
import { Match } from "src/decorators/match.decorator"
import { ApiProperty } from "@nestjs/swagger/dist"

export class UpdateUserDto {
    @ApiProperty({required: false})
    @IsOptional()
    first_name?: string

    @ApiProperty({required: false})
    @IsOptional()
    last_name?: string

    @ApiProperty({required: false})
    @IsOptional()
    @IsEmail()
    email?: string
  
    @ApiProperty({required: false})
    @IsOptional()
    avatar?: string

    @ApiProperty({required: false})
    @IsOptional()
    refresh_token?:string

    @ApiProperty({required: false})
    @ValidateIf((o)=> typeof o.password === 'string' && o.password.length > 0)
    @IsOptional()
    @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*=`|{}:;!.?"()[\]-]{6,}/,{
        message: 'PASSWORD MUST HAVE AT LEAST ONE NUMBER, LOWER OR UPPER CASE LETTER AND IT HAS TO BE LONGER THAN 5 CHARACTERS.',
    })
    password?: string


    @ApiProperty({required: false})
    @ValidateIf((o)=> typeof o.confirm_password === 'string' && o.confirm_password.length > 0)
    @IsOptional()
    @Match(UpdateUserDto, (field) => field.password, { message: 'Passwords do not match.'})
    confirm_password?: string
}