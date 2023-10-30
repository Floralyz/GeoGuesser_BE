import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Sight } from 'src/entities/sight.entity';
import { Repository } from 'typeorm';
import { CreateSightDto } from './dto/create-sight.dto';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { UpdateSightDto } from './dto/update-sight.dto';
import { PostgresErrorCode } from 'src/helpers/postgresErrorCode.enum';

@Injectable()
export class SightsService extends AbstractService {
  constructor(
    @InjectRepository(Sight)
    private readonly sightsRepository: Repository<Sight>,
  ) {
    super(sightsRepository);
  }

  async createSight(
    createSightDto: CreateSightDto,
    userId: string,
  ): Promise<Sight> {
    const sight = await this.findBy({ sight: createSightDto.sight });
    if (sight) {
      throw new BadRequestException('Isti sight že obstaja');
    }
    const newData = {
      ...createSightDto,
      user: { id: userId },
    };
    console.log(GetCurrentUserId);

    try {
      const newSight = this.sightsRepository.create(newData);
      const savedSight = await this.sightsRepository.save(newSight);
      return savedSight;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Nekaj je šlo narobe pri kreiranju nove Znamenitosti.',
      );
    }
  }

  async updateSight(
    id: string,
    updateSightDto: UpdateSightDto,
    userId: string,
  ): Promise<Sight> {
    const sights = (await this.findById(id)) as Sight;
    console.log(sights.sight);
    try {
      console.log('mjau');
      sights.sight = updateSightDto.sight;
      sights.hint = updateSightDto.hint;
      //sights.lat = updateSightDto.lat;
      //sights.lon = updateSightDto.lon;
      return this.sightsRepository.save(sights);
    } catch (error) {
      console.log(error);
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('The same quote already exists.');
      }
      throw new InternalServerErrorException(
        'Something went wrong while updating the quote.',
      );
    }
  }

  async getRecentSights(limit: number): Promise<Sight> {
    const dataSql = await this.sightsRepository.query(`
      SELECT 
      s.sight, s.id, s.lat, s.lon, s.hint, s.created_at, s.user_id, s.hint, s.image
      FROM 
        "sight" s JOIN "user" u ON s.user_id=u.id
      ORDER BY 
        s.created_at DESC
      LIMIT ${limit};
    `);
    return dataSql;
  }

  async getUserSights(id: string, limit: number): Promise<Sight> {
    const dataSql = await this.sightsRepository.query(`
    SELECT 
    u.first_name, u.last_name, s.id, s.sight, s.image, s.user_id, s.hint, s.lat, s.lon
FROM 
    "sight" s JOIN "user" u ON s.user_id=u.id
    WHERE
    s.user_id = '${id}'
LIMIT ${limit};
    `);
    return dataSql;
  }

  async update(sightId: string, updateSightDto: UpdateSightDto): Promise<Sight> {
    const sight = (await this.findById(sightId)) as Sight
    try {
      sight.image = updateSightDto.image
      return this.sightsRepository.save(sight)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Something went wrong while updating the sight.')
    }
  }

  async updateSightImage(id: string, image: string): Promise<Sight> {
    const sight = await this.findById(id)
    return this.update(sight.id, { ...sight, image })
  }

  async getSight(id: string): Promise<Sight> {
    const dataSql = await this.sightsRepository.query(`
    SELECT 
    id, sight, hint, image
FROM 
    "sight" 
WHERE
id = '${id}';
    `);
    return dataSql;
  }
}
