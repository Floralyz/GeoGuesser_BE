import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional } from "class-validator"



export class UpdateSightDto{

    @ApiProperty({required: true})
    @IsOptional()
    lat: number

    @ApiProperty({required: true})
    @IsOptional()
    lon: number


    @ApiProperty({required: true})
    @IsOptional()
    hint: string
    
    @ApiProperty({required: true})
    @IsOptional()
    sight: string
    
    @IsOptional()
  image?: string
    
}