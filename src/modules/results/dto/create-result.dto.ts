import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateQuizDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  ugot_lat: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  ugot_lon: number;

  @ApiProperty({ required: true })
  @IsOptional()
  razlika_km: number;
}
