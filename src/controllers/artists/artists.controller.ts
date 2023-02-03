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
import { CreateArtistDto } from 'src/dto/artists.dto';
import { Track } from 'src/models/track.interface';

@ApiTags('Artists')
@Controller('/artist')
export class ArtistsController {
  orm: CustomOrm;
  tracksOrm: CustomOrm;
  constructor(private readonly databaseService: DatabaseService) {
    this.orm = new CustomOrm(this.databaseService, 'artists');
    this.tracksOrm = new CustomOrm(this.databaseService, 'tracks');
  }

  @Get()
  getArtists() {
    const artists = this.orm.getAll();
    return artists;
  }

  @Get('/:id')
  getArtist(@Param('id') id: string) {
    if (!this.orm.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }
    const artist = this.orm.getById(id);

    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found!`);
    }

    return artist;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: false }))
  createTrack(@Body() createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    const insertData = { name, grammy };
    const inserted = this.orm.insertOne(insertData);
    return inserted;
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: false }))
  updateTrack(
    @Body() updateArtistDto: CreateArtistDto,
    @Param('id') id: string,
  ) {
    if (!this.orm.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    if (!this.orm.getById(id)) {
      throw new NotFoundException('Track not found!');
    }

    const { name, grammy } = updateArtistDto;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (grammy !== undefined) updateData.grammy = grammy;

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
      if (track.artistId === id) track.artistId = null;
      return track;
    });

    this.orm.deleteOne(id);
  }
}
