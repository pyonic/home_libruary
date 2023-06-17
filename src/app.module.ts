import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

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
      entities: [Users, Artists, Favorites, Albums, Tracks],
      synchronize: false,
    }),
    UserModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
    TracksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure() {}
}
