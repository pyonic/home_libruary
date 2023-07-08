import { AuthMiddleware } from './auth.middlware';
import { AuthService } from './auth.service';

export const authMiddlewareFactory = (authService: AuthService) => {
  return new AuthMiddleware(authService);
};
