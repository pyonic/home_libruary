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
import { CreateTrackDto } from 'src/dto/tracks.dto';

@ApiTags('Tracks')
@Controller('/track')
export class TracksController {
  orm: CustomOrm;
  constructor(private readonly databaseService: DatabaseService) {
    this.orm = new CustomOrm(this.databaseService, 'tracks');
  }

  @Get()
  getTracks() {
    const tracks = this.orm.getAll();
    return tracks;
  }

  @Get('/:id')
  getTrack(@Param('id') id: string) {
    if (!this.orm.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }
    const track = this.orm.getById(id);

    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found!`);
    }

    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: false }))
  createTrack(@Body() createTrackDto: CreateTrackDto) {
    const { name, artistId, albumId, duration } = createTrackDto;
    const insertData = { name, artistId, albumId, duration };
    const inserted = this.orm.insertOne(insertData);
    return inserted;
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: false }))
  updateTrack(@Body() updateTrackDto: CreateTrackDto, @Param('id') id: string) {
    if (!this.orm.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    if (!this.orm.getById(id)) {
      throw new NotFoundException('Track not found!');
    }

    const { name, artistId, albumId, duration } = updateTrackDto;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (artistId) updateData.artistId = artistId;
    if (albumId) updateData.albumId = albumId;
    if (duration) updateData.duration = duration;

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

    this.orm.deleteOne(id);
  }
}
