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
  UnprocessableEntityException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CustomOrm } from 'src/database/zorm.service';
import { CreateFavoriteDto } from 'src/dto/favs.dto';
import { Album } from 'src/models/album.interface';
import { Artist } from 'src/models/artist.interface';
import { Track } from 'src/models/track.interface';
import { Favorites } from 'src/models/favorite.interface';
import { ApiTags } from '@nestjs/swagger';

const TEMPLATE_FAV = {
  artists: [],
  albums: [],
  tracks: [],
};

@ApiTags('Favorites')
@Controller('/favs')
export class FavoritesController {
  orm: CustomOrm;
  tracksOrm: CustomOrm;
  constructor(private readonly databaseService: DatabaseService) {
    this.orm = new CustomOrm(this.databaseService, 'favorites');
  }

  @Get()
  getFavorites() {
    const favs = this.orm.getAll() || [TEMPLATE_FAV];

    return this.parseFav(favs.length > 0 ? favs[0] : TEMPLATE_FAV);
  }

  // Tracks
  @Post('/track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrack(@Param('id') id: string) {
    return this.insertToFav(id, 'tracks');
  }

  @Delete('/track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id') id: string) {
    return this.deleteFromFav(id, 'tracks');
  }

  // Albums
  @Post('/album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbum(@Param('id') id: string) {
    return this.insertToFav(id, 'albums');
  }

  @Delete('/album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id') id: string) {
    return this.deleteFromFav(id, 'albums');
  }

  // Artists
  @Post('/artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtist(@Param('id') id: string) {
    return this.insertToFav(id, 'artists');
  }

  @Delete('/artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id') id: string) {
    return this.deleteFromFav(id, 'artists');
  }

  @Get('/:id')
  getFavorite(@Param('id') id: string) {
    if (!this.orm.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }
    const fav = this.orm.getById(id);

    if (!fav) {
      throw new NotFoundException(`Favorite with id ${id} not found!`);
    }

    return fav;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: false }))
  createFavorite(@Body() createFavoriteDto: CreateFavoriteDto) {
    const { artists, albums, tracks } = createFavoriteDto;
    const insertData = { artists, albums, tracks };
    const inserted = this.orm.insertOne(insertData);
    return inserted;
  }

  insertToFav(id, data_table) {
    if (!this.orm.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }
    const artist = this.orm.getById(id, data_table);

    if (!artist) {
      throw new UnprocessableEntityException(
        `Data with ${id} inside ${data_table} not found!`,
      );
    }

    const favorites = this.orm.getAll();
    const fav: Favorites | any =
      favorites.length > 0 ? favorites[0] : TEMPLATE_FAV;

    fav[data_table].push(id);

    return { message: 'Added to favorites' };
  }

  deleteFromFav(id, data_table) {
    if (!this.orm.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }
    const artist = this.orm.getById(id, data_table);

    if (!artist) {
      throw new NotFoundException(
        `Data with ${id} inside ${data_table} not found!`,
      );
    }

    const favorites = this.orm.getAll();
    const fav: Favorites | any =
      favorites.length > 0 ? favorites[0] : TEMPLATE_FAV;

    const updated = fav[data_table].filter((alb) => alb !== id).map((a) => a);
    fav[data_table] = updated;

    return { message: 'Deleted from favorites' };
  }

  parseFav(fav) {
    const artists: Array<Artist> = fav.artists.map((art) => {
      const artist = this.orm.getById(art, 'artists');
      return artist;
    });

    const albums: Array<Album> = fav.albums.map((alb) => {
      const album = this.orm.getById(alb, 'albums');
      return album;
    });

    const tracks: Array<Track> = fav.tracks.map((art) => {
      const track = this.orm.getById(art, 'tracks');
      return track;
    });
    console.log('WHAT? ', artists);

    return {
      artists: artists.filter((d) => d).map((d) => d),
      albums: albums.filter((d) => d).map((d) => d),
      tracks: tracks.filter((d) => d).map((d) => d),
    };
  }
}
