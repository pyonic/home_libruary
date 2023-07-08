import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly login: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}

export class UpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  newPassword: string;
}
