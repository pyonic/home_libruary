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
import { CreateAlbumDto } from 'src/dto/albums.dto';
import { AlbumsService } from './album.service';

@ApiTags('albums')
@Controller('/album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async getAlbums() {
    return this.albumsService.getAll();
  }

  @Get('/:id')
  async getArtist(@Param('id') id: string) {
    return await this.albumsService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: false }))
  async createAlbum(@Body() createArtistDto: CreateAlbumDto) {
    const { name, year, artistId } = createArtistDto;
    const insertData = { name, year, artistId };

    return await this.albumsService.createAlbum(insertData);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: false }))
  async updateAlbum(
    @Body() updateArtistDto: CreateAlbumDto,
    @Param('id') id: string,
  ) {
    return await this.albumsService.updateAlbum(id, updateArtistDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id') id: string) {
    return await this.albumsService.deleteAlbum(id);
  }
}
