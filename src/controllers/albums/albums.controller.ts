import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DatabaseService } from 'src/database/database.service';
import { CustomOrm } from 'src/database/zorm.service';
import { CreateAlbumDto } from 'src/dto/albums.dto';
import { Track } from 'src/models/track.interface';

@ApiTags('albums')
@Controller('/album')
export class AlbumsController {
  orm: CustomOrm;
  tracksOrm: CustomOrm;
  constructor(private readonly databaseService: DatabaseService) {
    this.orm = new CustomOrm(this.databaseService, 'albums');
    this.tracksOrm = new CustomOrm(this.databaseService, 'tracks');
  }

  @Get()
  getAlbums() {
    const albums = this.orm.getAll();
    return albums;
  }

  @Get('/:id')
  getArtist(@Param('id') id: string) {
    if (!this.orm.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }
    const album = this.orm.getById(id);

    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found!`);
    }

    return album;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: false }))
  createTrack(@Body() createArtistDto: CreateAlbumDto) {
    const { name, year, artistId } = createArtistDto;
    const insertData = { name, year, artistId };
    const inserted = this.orm.insertOne(insertData);
    return inserted;
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: false }))
  updateTrack(
    @Body() updateArtistDto: CreateAlbumDto,
    @Param('id') id: string,
  ) {
    if (!this.orm.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    if (!this.orm.getById(id)) {
      throw new NotFoundException('Album not found!');
    }

    const { name, year, artistId } = updateArtistDto;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (year) updateData.year = year;
    if (artistId) updateData.artistId = artistId;

    const inserted = this.orm.updateOne(id, updateData);
    return inserted;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id') id: string) {
    if (!this.orm.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    if (!this.orm.getById(id)) {
      throw new NotFoundException('Track not found!');
    }

    const tracks = this.tracksOrm.getAll();

    tracks.map((track: Track) => {
      if (track.albumId === id) track.albumId = null;
      return track;
    });

    this.orm.deleteOne(id);
  }
}
