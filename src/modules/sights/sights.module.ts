import { Module } from '@nestjs/common';
import { SightsService } from './sights.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sight } from 'src/entities/sight.entity';
import { SightsController } from './sights.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Sight]), JwtModule],
  controllers: [SightsController],
  providers: [SightsService],
  exports: [SightsService],
})
export class SightsModule {}
