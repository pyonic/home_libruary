import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  artistId: string | null;

  @IsOptional()
  @ApiProperty()
  @IsString()
  albumId: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
