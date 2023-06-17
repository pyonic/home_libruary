import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Tracks } from "../tracks/tracks.repository";
import { Favorites } from "./favorites.repository";
import { Albums } from "../albums/albums.repository";
import { Artists } from "../artists/artist.repository";
import { TracksService } from "../tracks/tracks.service";
import { ArtistsService } from "../artists/artist.service";
import { AlbumsService } from "../albums/album.service";

const TEMPLATE_FAV = {
  artists: [],
  albums: [],
  tracks: [],
};

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorites)
        private FavoritesRepository: Repository<Favorites>,
        private tracksService: TracksService,
        private artistsService: ArtistsService,
        private albumsService: AlbumsService,
    ) {}

    isUUID(str: string): boolean {
        const pattern =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return pattern.test(str);
    }

    async findOne(id: string): Promise<Favorites> {
        return this.FavoritesRepository.findOne({
            where: { id }
        });
    }
    
    async getAll(): Promise<Array<Favorites>> {
        return await this.FavoritesRepository.find();
    }

    async createFavorite(favorite: any): Promise<Favorites> {
        return await this.FavoritesRepository.save(favorite);
    }

    async getById(id: string): Promise<Favorites> {
        if (!this.isUUID(id)) {
            throw new BadRequestException(`${id} is not UUID!`);
          }
      
          const favorite: any = await this.findOne(id);
      
          if (!favorite) {
            throw new NotFoundException(`Favorite with id ${id} is not found!`);
          }
      
          return favorite;
    }

    async updateFavorite(id: string, data: any): Promise<Favorites> {
        if (!this.isUUID(id)) {
            throw new BadRequestException(`${id} is not UUID!`);
        }
    
        let favorite = await this.getById(id);
    
        const { name, grammy } = data;
    
        const updateData: any = {};
    
        if (name) updateData.name = name;
        if (grammy !== undefined) updateData.grammy = grammy;
    
        favorite = { ...favorite, ...updateData }

        return await this.FavoritesRepository.save(favorite);
    }

    async deletefavorite(id: string) {
        return null
    }

    async insertToFav(id, data_table) {
        if (!this.isUUID(id)) {
          throw new BadRequestException(`${id} is not UUID!`);
        }

        let entity = null;
        
        if (data_table == "tracks") {
          entity = await this.tracksService.findOne(id);
        } else if ( data_table == "artists" ) {
          entity = await this.artistsService.findOne(id);
        } else if (data_table == "albums") {
          entity = await this.albumsService.findOne(id);
        }

        if (!entity) {
          throw new UnprocessableEntityException(
            `Data with ${id} inside ${data_table} not found!`,
          );
        }
    
        const favorites = await this.getAll();
        const fav: Favorites | any = favorites.length > 0 ? favorites[0] : TEMPLATE_FAV;
    
        fav[data_table].push(id);

        await this.FavoritesRepository.save(fav);
    
        return { message: 'Added to favorites' };
      }

      async deleteFromFav(id, data_table) {
        if (!this.isUUID(id)) {
          throw new BadRequestException(`${id} is not UUID!`);
        }
        let entity = null;
        
        if (data_table == "tracks") {
          entity = await this.tracksService.findOne(id);
        } else if ( data_table == "artists" ) {
          entity = await this.artistsService.findOne(id);
        } else if (data_table == "albums") {
          entity = await this.albumsService.findOne(id);
        }

        if (!entity) {
          throw new UnprocessableEntityException(
            `Data with ${id} inside ${data_table} not found!`,
          );
        }
    
        const favorites = await this.getAll();
        const fav: Favorites | any =
          favorites.length > 0 ? favorites[0] : TEMPLATE_FAV;
    
        const updated = fav[data_table].filter((alb) => alb !== id).map((a) => a);
        fav[data_table] = updated;

        await this.FavoritesRepository.save(fav)
    
        return { message: 'Deleted from favorites' };
      }

    async parseFav(fav: any) {
      const artists: Array<Artists> = await this.artistsService.getAll({ where: { "id": In(fav.artists) } })
  
      const albums: Array<Albums> = await this.albumsService.getAll({ where: { "id": In(fav.albums) } });
  
      const tracks: Array<Tracks> = await this.tracksService.getAll({ where: { "id": In(fav.tracks) } });
  
      return {
        artists: artists.filter((d) => d).map((d) => d),
        albums: albums.filter((d) => d).map((d) => d),
        tracks: tracks.filter((d) => d).map((d) => d),
      };
    }
}