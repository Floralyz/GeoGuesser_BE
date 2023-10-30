import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from 'src/entities/result.entity';
import { User } from 'src/entities/user.entity';
import { Sight } from 'src/entities/sight.entity';
import { JwtModule } from '@nestjs/jwt';
import { Leaderboard } from 'src/entities/leaderboard';

@Module({
  imports: [TypeOrmModule.forFeature([Result, User, Sight, Leaderboard]), JwtModule],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService]
})
export class ResultsModule {}
