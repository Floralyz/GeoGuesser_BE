import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Leaderboard } from 'src/entities/leaderboard';
import { Result } from 'src/entities/result.entity';
import { Sight } from 'src/entities/sight.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateQuizDto } from '../results/dto/create-result.dto';

@Injectable()
export class LeaderboardService extends AbstractService {
  constructor(
    @InjectRepository(Result)
    private readonly resultsRepository: Repository<Result>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepository: Repository<Leaderboard>,
  ) {
    super(leaderboardRepository);
  }

  async getLeaderboardForSight(id: string, limit: number): Promise<Result> {
    const dataSql = await this.resultsRepository.query(
      `SELECT CONCAT(u.first_name, ' ', u.last_name) AS username, l.datum, l.razlika, u.avatar, r.sight_id, s.sight, r.razlika_km
      FROM "result" r
       JOIN "user" u  ON r.user_id = u.id
       JOIN "sight" s ON r.sight_id = s.id
       JOIN "leaderboard" l ON l.result_id = r.id
       WHERE
       r.sight_id = '${id}'
       ORDER BY 
  r.razlika_km ASC
  LIMIT ${limit}
       ;`,
    );
    return dataSql;
  }




}
