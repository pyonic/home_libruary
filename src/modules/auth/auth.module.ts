import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/users.repository';
import { AuthService } from './auth.service';
import { UserModule } from '../users/users.module';
import { UsersService } from '../users/user.service';
import { RefreshTokensRepository } from './auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([RefreshTokensRepository]),
    UserModule,
    Users,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
