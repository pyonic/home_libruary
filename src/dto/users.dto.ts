import { IsString, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly login: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  oldPassword: string;
  
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  newPassword: string;
}