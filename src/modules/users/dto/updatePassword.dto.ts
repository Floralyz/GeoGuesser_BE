import {  IsOptional, IsEmail, Matches, ValidateIf, isNotEmpty, IsNotEmpty } from "class-validator"
import { Match } from "src/decorators/match.decorator"
import { ApiProperty } from "@nestjs/swagger/dist"


export class UpdateUserPasswordDto{
    @ApiProperty({required: true})
    @IsNotEmpty()
    current_password:string
    
    @ApiProperty({required: false})
    @ValidateIf((o) => typeof o.password === 'string' && o.password.length>0)
    @IsOptional()
   /* @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{-6,}/, {
        message: 'PASSWORD MUST HAVE AT LEAST ONE NUMBER, LOWER OR UPPER CASE LETTER AND IT HAS TO BE LONGER THAN 5 CHARACTERS.',
    })*/
    password?:string

    @ApiProperty({required: false})
    @ValidateIf((o) => typeof o.confirm_password === 'string' && o.confirm_password.length>0)
    @IsOptional()
    @Match(UpdateUserPasswordDto, (field) => field.password, {message: 'Passwords do not match.'})
    confirm_password?:string
}