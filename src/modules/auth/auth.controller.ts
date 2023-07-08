import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthDto, RefreshDto } from 'src/dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @Post('/signup')
  async signUp(@Body() authBody: AuthDto) {
    return await this.authService.signUp(authBody);
  }

  @HttpCode(200)
  @Post('/login')
  async login(@Body() authBody: AuthDto) {
    return await this.authService.signIn(authBody);
  }

  @HttpCode(200)
  @Post('/refresh')
  async refresh(@Body() refreshBody: RefreshDto) {
    return await this.authService.refreshToken(refreshBody);
  }
}
