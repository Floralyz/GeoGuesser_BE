import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboards.service';
import { LeaderboardController } from './leaderboards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leaderboard } from 'src/entities/leaderboard';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { Result } from 'src/entities/result.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Leaderboard, User, Result]), JwtModule],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [LeaderboardService]
})
export class LeaderboardsModule {}
