import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tracks } from './tracks.repository';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Tracks)
    private tracksRepository: Repository<Tracks>,
  ) {}

  isUUID(str: string): boolean {
    const pattern =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return pattern.test(str);
  }

  async findOne(id: string): Promise<Tracks> {
    return this.tracksRepository.findOne({
      where: { id },
    });
  }

  async getAll(query: FindManyOptions = {}): Promise<Array<Tracks>> {
    return await this.tracksRepository.find(query);
  }

  async createTrack(track: any): Promise<Tracks> {
    return await this.tracksRepository.save(track);
  }

  async getById(id: string): Promise<Tracks> {
    if (!this.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    const track: any = await this.findOne(id);

    if (!track) {
      throw new NotFoundException(`Track with id ${id} is not found!`);
    }

    return track;
  }

  async updateTrack(id: string, data: any): Promise<Tracks> {
    if (!this.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    let track = await this.getById(id);

    const { name, artistId, albumId, duration } = data;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (artistId) updateData.artistId = artistId;
    if (albumId) updateData.albumId = albumId;
    if (duration) updateData.duration = duration;

    track = { ...track, ...updateData };

    return await this.tracksRepository.save(track);
  }

  async deleteTrack(id: string) {
    if (!this.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    if (!(await this.getById(id))) {
      throw new NotFoundException('Track not found!');
    }

    await this.getById(id);

    await this.tracksRepository.delete(id);
  }
}
