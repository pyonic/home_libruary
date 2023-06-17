import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Tracks } from '../tracks/tracks.repository';
import { Artists } from './artist.repository';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artists)
    private artistsRepository: Repository<Artists>,
    @InjectRepository(Tracks)
    private tracksRepository: Repository<Tracks>,
  ) {}

  isUUID(str: string): boolean {
    const pattern =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return pattern.test(str);
  }

  async findOne(id: string): Promise<Artists> {
    return this.artistsRepository.findOne({
      where: { id },
    });
  }

  async getAll(query: FindManyOptions = {}): Promise<Array<Artists>> {
    return await this.artistsRepository.find(query);
  }

  async createArtist(Artist: any): Promise<Artists> {
    return await this.artistsRepository.save(Artist);
  }

  async getById(id: string): Promise<Artists> {
    if (!this.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    const artist: any = await this.findOne(id);

    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} is not found!`);
    }

    return artist;
  }

  async updateArtist(id: string, data: any): Promise<Artists> {
    if (!this.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    let artist = await this.getById(id);

    const { name, grammy } = data;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (grammy !== undefined) updateData.grammy = grammy;

    artist = { ...artist, ...updateData };

    return await this.artistsRepository.save(artist);
  }

  async deleteArtist(id: string) {
    if (!this.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    await this.getById(id);

    const tracks = await this.tracksRepository.find();

    const updates = [];

    tracks.forEach((track: Tracks) => {
      if (track.artistId === id) track.artistId = null;
      updates.push(this.tracksRepository.save(track));
    });

    await Promise.all(updates);

    return await this.artistsRepository.delete(id);
  }
}
