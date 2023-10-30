import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from 'src/interfaces/auth.interface';
import { CreateQuizDto } from './dto/create-result.dto';
import { Result } from 'src/entities/result.entity';

@ApiTags('quiz')
@Controller('quiz')
@UseInterceptors(ClassSerializerInterceptor)
export class ResultsController {
   constructor(
    private readonly resultsService: ResultsService,
    )
    {}

    @Post('post/:id')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async addQuiz(
        @Param('id') id:string,
        @Req() request: RequestWithUser,
        @Body() createQuizDto: CreateQuizDto,
    ){
        console.log(request.user.id);
        console.log(id);
        return this.resultsService.createQuiz(id, createQuizDto, request.user.id)
    }

    @Get('leaderboard/:id')
    @HttpCode(HttpStatus.OK)
    async getLeaderboard(
        @Param('id') id:string,
        @Query('limit') limit = 13,
    ){
        return this.resultsService.getLeaderboardForSight(id, limit)
    }

    @Get('user/:id')
    @HttpCode(HttpStatus.OK)
    async getUserBestGuesses(
        @Param('id') id:string,
        @Query('limit') limit = 4 
    ){
        return this.resultsService.getUserBestGuesses(id, limit)
    }

    
  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async removeQuote(@Param('id') id: string): Promise<Result> {
    return this.resultsService.remove(id);
  }


}
