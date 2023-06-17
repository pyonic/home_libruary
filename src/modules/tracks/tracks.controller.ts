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
import { CreateTrackDto } from 'src/dto/tracks.dto';
import { TracksService } from './tracks.service';

@ApiTags('Tracks')
@Controller('/track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  async getTracks() {
    // TEst
    return await this.tracksService.getAll();
  }

  @Get('/:id')
  async getTrack(@Param('id') id: string) {
    return await this.tracksService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: false }))
  async createTrack(@Body() createTrackDto: CreateTrackDto) {
    const { name, artistId, albumId, duration } = createTrackDto;
    const insertData = { name, artistId, albumId, duration };
    return await this.tracksService.createTrack(insertData);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: false }))
  async updateTrack(@Body() updateTrackDto: CreateTrackDto, @Param('id') id: string) {
    return await this.tracksService.updateTrack(id, updateTrackDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id') id: string) {
    return await this.tracksService.deleteTrack(id);
  }
}
