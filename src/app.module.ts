import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { UserService } from './controllers/users/user.service';
import { TracksController } from './controllers/tracks/tracks.controller';
import { UserController } from './controllers/users/user.controller';
import { UserExistenceMiddleware } from './middlwares/all.middlwares';

@Module({
  imports: [],
  controllers: [UserController, TracksController],
  providers: [UserService, DatabaseService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserExistenceMiddleware)
      .forRoutes({
        path: '/user/:id',
        method: RequestMethod.PUT,
      });
  }
}
