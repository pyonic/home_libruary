import { Inject, Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { UserService } from "src/controllers/users/user.service";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class UserExistenceMiddleware implements NestMiddleware {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  use(req: any, res: any, next: () => void) {
    const { id } = req.params;
    if(Object.keys(req.body)) {
      return next()
    } else {
      const data = this.databaseService.findMatching('users', 'id', id);
      
      if (!data) {
          throw new NotFoundException(`User with id: ${id} is not found!`)
      }
    }


    next();
  }
}