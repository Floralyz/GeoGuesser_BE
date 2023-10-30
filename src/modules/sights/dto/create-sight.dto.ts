import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional } from "class-validator"



export class CreateSightDto{

    @ApiProperty({required: true})
    @IsNotEmpty()
    lat: number

    @ApiProperty({required: true})
    @IsNotEmpty()
    lon: number


    @ApiProperty({required: true})
    @IsNotEmpty()
    hint: string
    
    @ApiProperty({required: true})
    @IsNotEmpty()
    sight: string
    
    
    
}