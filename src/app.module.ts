import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { configValidationSchema } from './config/schema.config';
import { DatabaseModule } from './modules/database/database.module';
import { SightsController } from './modules/sights/sights.controller';
import { SightsModule } from './modules/sights/sights.module';
import { UsersModule } from './modules/users/users.module';
import { AppService } from './app.service';
import { UtilsModule } from './utils/utils.module';
import { ResultsModule } from './modules/results/results.module';
import { LeaderboardsModule } from './modules/leaderboards/leaderboards.module';
import { RolesModule } from './modules/roles/roles.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
   DatabaseModule,
   UsersModule,
    AuthModule,
    SightsModule,
    UtilsModule,
    ResultsModule,
    LeaderboardsModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
