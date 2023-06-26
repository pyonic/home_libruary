import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
import { UserModule } from './modules/users/users.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { Users } from './modules/users/users.repository';
import { Favorites } from './modules/favorites/favorites.repository';
import { Albums } from './modules/albums/albums.repository';
import { Tracks } from './modules/tracks/tracks.repository';
import { Artists } from './modules/artists/artist.repository';
import { AuthModule } from './modules/auth/auth.module';
import { RefreshTokensRepository } from './modules/auth/auth.repository';
import { AuthMiddleware } from './modules/auth/auth.middlware';
import { AuthService } from './modules/auth/auth.service';
import { APP_FILTER } from '@nestjs/core';
import { LoggerMiddleware } from './modules/logger/logger.middleware';
import { ExceptionsFilter } from './modules/logger/exception.filter';
import { CustomLoggerService } from './modules/logger/logger.service';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        Users,
        Artists,
        Favorites,
        Albums,
        Tracks,
        RefreshTokensRepository,
      ],
      synchronize: false,
    }),
    UserModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
    TracksModule,
    AuthModule,
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([RefreshTokensRepository]),
  ],
  controllers: [],
  providers: [
    CustomLoggerService,
    AuthService,
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/', 'auth/refresh', '/doc')
      .forRoutes('user', 'track', 'artist', 'favs', 'albums');

    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
