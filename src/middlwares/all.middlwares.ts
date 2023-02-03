import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ExistenceMiddleware implements NestMiddleware {
  constructor(private readonly databaseService: DatabaseService) {}

  use(req: any, res: any, next: () => void) {
    const route = req.url.match(/^\/(\w+)\/.*$/)[1];
    const { id } = req.params;
    if (Object.keys(req.body).length === 0) {
      return next();
    } else {
      if (!this.databaseService.isUUID(id)) {
        throw new BadRequestException(`${id} is not UUID!`);
      }

      const data = this.databaseService.findMatching(`${route}s`, 'id', id);
      console.log('data: ', data, route, id);

      if (!data) {
        throw new NotFoundException(`${route} with id: ${id} is not found!`);
      }
    }

    next();
  }
}
