import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from 'src/interfaces/auth.interface';
import { ResultsService } from '../results/results.service';
import { LeaderboardService } from './leaderboards.service';
import { UsersService } from '../users/users.service';

@ApiTags('leaderboard')
@Controller('leaderboard')
@UseInterceptors(ClassSerializerInterceptor)
export class LeaderboardController {
   constructor(
    private readonly leaderboardService: LeaderboardService,
    )
    {}

    @Get('sight/:id')
    @HttpCode(HttpStatus.OK)
    async getLeaderboard(
        @Param('id') id:string,
        @Query('limit') limit = 13,
    ){
    
        return this.leaderboardService.getLeaderboardForSight(id, limit)
    }


}
