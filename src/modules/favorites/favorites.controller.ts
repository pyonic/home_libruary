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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateFavoriteDto } from 'src/dto/favs.dto';
import { ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';

const TEMPLATE_FAV = {
  artists: [],
  albums: [],
  tracks: [],
};

@ApiTags('Favorites')
@Controller('/favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getFavorites() {
    const favs = await this.favoritesService.getAll() || [TEMPLATE_FAV];

    return await this.favoritesService.parseFav(favs.length > 0 ? favs[0] : TEMPLATE_FAV);
  }

  // Tracks
  @Post('/track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrack(@Param('id') id: string) {
    return await this.favoritesService.insertToFav(id, 'tracks');
  }

  @Delete('/track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id') id: string) {
    return await this.favoritesService.deleteFromFav(id, 'tracks');
  }

  // Albums
  @Post('/album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbum(@Param('id') id: string) {
    return await this.favoritesService.insertToFav(id, 'albums');
  }

  @Delete('/album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(@Param('id') id: string) {
    return await this.favoritesService.deleteFromFav(id, 'albums');
  }

  // Artists
  @Post('/artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtist(@Param('id') id: string) {
    return await this.favoritesService.insertToFav(id, 'artists');
  }

  @Delete('/artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(@Param('id') id: string) {
    return await this.favoritesService.deleteFromFav(id, 'artists');
  }

  @Get('/:id')
  async getFavorite(@Param('id') id: string) {
    return await this.favoritesService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: false }))
  async createFavorite(@Body() createFavoriteDto: CreateFavoriteDto) {
    const { artists, albums, tracks } = createFavoriteDto;
    const insertData = { artists, albums, tracks };
    
    console.log("CRETE: ", createFavoriteDto);
    
    return await this.favoritesService.createFavorite(insertData);
  }
}
