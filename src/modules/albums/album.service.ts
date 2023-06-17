import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Albums } from "./albums.repository";
import { Tracks } from "../tracks/tracks.repository";

@Injectable()
export class AlbumsService {
    constructor(
        @InjectRepository(Albums)
        private albumsRepository: Repository<Albums>,
        @InjectRepository(Tracks)
        private tracksRepository: Repository<Tracks>,
    ) {}

    isUUID(str: string): boolean {
        const pattern =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return pattern.test(str);
    }

    async findOne(id: string): Promise<Albums> {
        return this.albumsRepository.findOne({
            where: { id }
        });
    }
    
    async getAll(query: FindManyOptions = {}): Promise<Array<Albums>> {
        return await this.albumsRepository.find(query);
    }

    async createAlbum(album: any): Promise<Albums> {
        return await this.albumsRepository.save(album);
    }

    async getById(id: string): Promise<Albums> {
        if (!this.isUUID(id)) {
            throw new BadRequestException(`${id} is not UUID!`);
          }
      
          const album: any = await this.findOne(id);
      
          if (!album) {
            throw new NotFoundException(`Album with id ${id} is not found!`);
          }
      
          return album;
    }

    async updateAlbum(id: string, data: any): Promise<Albums> {
        if (!this.isUUID(id)) {
            throw new BadRequestException(`${id} is not UUID!`);
        }
      
        let album = await this.getById(id);
    
        const { name, year, artistId } = data;
    
        const updateData: any = {};
    
        if (name) updateData.name = name;
        if (year) updateData.year = year;
        if (artistId) {
            if (!this.isUUID(artistId)) {
                throw new BadRequestException(`${artistId} is not UUID!`);
            }
            updateData.artistId = artistId;
        }

        album = { ...album, ...updateData }
    
        const inserted = await this.albumsRepository.save(album);

        return inserted;
    }

    async deleteAlbum(id: string) {
        if (!this.isUUID(id)) {
            throw new BadRequestException(`${id} is not UUID!`);
        }
    
        await this.getById(id);
    
        const tracks = await this.tracksRepository.find();
        
        const updates = []

        tracks.forEach((track: Tracks) => {
            if (track.albumId === id) track.albumId = null;
            updates.push(this.tracksRepository.save(track));
        });

        await Promise.all(updates);
    
        this.albumsRepository.delete(id);
    }
}