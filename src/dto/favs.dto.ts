import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFavoriteDto {
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty()
  artists: string[];

  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty()
  albums: string[];

  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty()
  tracks: string[];
}
