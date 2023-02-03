import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { UserService } from './controllers/users/user.service';
import { TracksController } from './controllers/tracks/tracks.controller';
import { UserController } from './controllers/users/user.controller';
import { ExistenceMiddleware } from './middlwares/all.middlwares';
import { ArtistsController } from './controllers/artists/artists.controller';
import { AlbumsController } from './controllers/albums/albums.controller';

@Module({
  imports: [],
  controllers: [
    UserController,
    TracksController,
    ArtistsController,
    AlbumsController
  ],
  providers: [UserService, DatabaseService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExistenceMiddleware)
      .forRoutes({
        path: '/user/:id',
        method: RequestMethod.PUT,
      });
  }
}