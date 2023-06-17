import { Module } from "@nestjs/common";
import { FavoritesController } from "./favorites.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorites } from "./favorites.repository";
import { TracksService } from "../tracks/tracks.service";
import { ArtistsService } from "../artists/artist.service";
import { AlbumsService } from "../albums/album.service";
import { FavoritesService } from "./favorites.service";
import { TracksModule } from "../tracks/tracks.module";
import { ArtistsModule } from "../artists/artists.module";
import { AlbumsModule } from "../albums/albums.module";
import { Tracks } from "../tracks/tracks.repository";
import { Artists } from "../artists/artist.repository";
import { Albums } from "../albums/albums.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([Favorites, Tracks, Artists, Albums]),
        TracksModule,
        ArtistsModule,
        AlbumsModule
    ],
    controllers: [FavoritesController],
    providers: [FavoritesService, TracksService, ArtistsService, AlbumsService]
})
export class FavoritesModule {

}