import { IsString, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @IsNotEmpty()
  readonly login: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
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