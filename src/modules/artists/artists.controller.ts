import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateArtistDto } from 'src/dto/artists.dto';
import { ArtistsService } from './artist.service';

@ApiTags('Artists')
@Controller('/artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  async getArtists() {
    return await this.artistsService.getAll();
  }

  @Get('/:id')
  async getArtist(@Param('id') id: string) {
    return await this.artistsService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: false }))
  async createTrack(@Body() createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    const insertData = { name, grammy };
    return await this.artistsService.createArtist(insertData);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: false }))
  async updateTrack(
    @Body() updateArtistDto: CreateArtistDto,
    @Param('id') id: string,
  ) {
    return await this.artistsService.updateArtist(id, updateArtistDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id') id: string) {
    return await this.artistsService.deleteArtist(id);
  }
}
