import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedException('Token not found!');
    }

    const token = authorization.split(' ')[1];

    try {
      await this.authService.verifyToken(token);
    } catch (err) {
      throw new UnauthorizedException('Auth failed');
    }

    next();
  }
}
