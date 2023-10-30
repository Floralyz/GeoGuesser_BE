import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Result } from 'src/entities/result.entity';
import { Sight } from 'src/entities/sight.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateQuizDto } from './dto/create-result.dto';
import { string } from 'joi';
import { Leaderboard } from 'src/entities/leaderboard';

@Injectable()
export class ResultsService extends AbstractService {
  constructor(
    @InjectRepository(Result)
    private readonly resultsRepository: Repository<Result>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Sight)
    private readonly sightRepository: Repository<Sight>,
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepository: Repository<Leaderboard>,
  ) {
    super(resultsRepository);
  }


      
  async createQuiz(
    id: string,
    createQuizDto: CreateQuizDto,
    userId: string,
  ): Promise<Result> {
    console.log(id, userId);
    function toRad(x) {
      return (x * Math.PI) / 180;
    }
    try {
      const [sight] = await this.sightRepository.query(`
      SELECT *
      FROM "sight"
      WHERE
      id= '${id}';
      `);

      

      const lat1 = sight.lat;
      const lon1 = sight.lon;
      const lat2 = createQuizDto.ugot_lat;
      const lon2 = createQuizDto.ugot_lon;
      const R = 6371;

      const x1 = lat2 - lat1;
      const dLat = toRad(x1);
      const x2 = lon2 - lon1;
      const dLon = toRad(x2);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;

      console.log(userId);
      console.log(d);

const formatDistance = (distanceInKm: number) => {
        if (distanceInKm < 1) {
          // If distance is less than 1 km, display it in meters
          return `${(distanceInKm * 1000).toFixed(0)} m`
        } else {
          // Display distance in kilometers
          return `${distanceInKm.toFixed(2)} km`
        }
      }

      const ResultData = {
        user: { id: userId },
        sight: { id: sight.id },
        razlika_km: d,
        razlika: formatDistance(d),
        ...createQuizDto,
      };

const newResult = this.resultsRepository.create(ResultData);
      await this.resultsRepository.save(newResult);


      const LeaderboardData = {
        user : { id : userId },
        razlika: formatDistance(d),
        result: {id: newResult.id},
      }
      await this.leaderboardRepository.save(LeaderboardData);
      
      return newResult;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Nekaj je šlo narobe pri kreiranju novega Rezultata.',
      );
    }
  }

  async getLeaderboardForSight(id: string, limit: number): Promise<Result> {
    const dataSql = await this.resultsRepository.query(
      `SELECT CONCAT(u.first_name, ' ', u.last_name) AS username, r.datum, r.razlika, u.avatar, s.id
      FROM "result" r
       JOIN "user" u  ON r.user_id = u.id
       JOIN "sight" s ON r.sight_id = s.id
       WHERE
       r.sight_id = '${id}'
       ORDER BY 
  r.razlika_km ASC
  LIMIT ${limit}
       ;`,
    );

    
    return dataSql;
  }

  async getUserBestGuesses(id: string, limit: number): Promise<Result> {
    const dataSql = await this.resultsRepository.query(
      `SELECT  s.sight, r.razlika, r.sight_id, u.id, s.image
      FROM "result" r
       JOIN "user" u  ON r.user_id = u.id
       JOIN "sight" s ON r.sight_id = s.id
       WHERE
       u.id = '${id}'
       ORDER BY 
  r.razlika_km ASC
  LIMIT ${limit}
       ;`,
    );
    return dataSql;
  }
}
