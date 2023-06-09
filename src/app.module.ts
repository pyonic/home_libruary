import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseService } from './database/database.service';
import { TracksController } from './controllers/tracks/tracks.controller';
import { UserController } from './controllers/users/user.controller';
import { ExistenceMiddleware } from './middlwares/all.middlwares';
import { ArtistsController } from './controllers/artists/artists.controller';
import { AlbumsController } from './controllers/albums/albums.controller';
import { FavoritesController } from './controllers/favorites/favs.controller';

import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 3306,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [
    UserController,
    TracksController,
    ArtistsController,
    AlbumsController,
    FavoritesController,
  ],
  providers: [DatabaseService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExistenceMiddleware).forRoutes({
      path: '/user/:id',
      method: RequestMethod.PUT,
    });
  }
}
