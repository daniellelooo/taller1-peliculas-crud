import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MoviesController } from './movies.controller.js';
import { MoviesService } from './movies.service.js';

@Module({
  // AuthModule exporta PassportModule, necesario para usar JwtAuthGuard aqui.
  imports: [AuthModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
