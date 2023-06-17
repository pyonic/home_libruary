import { Module } from "@nestjs/common";
import { ArtistsController } from "./artists.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tracks } from "../tracks/tracks.repository";
import { Artists } from "./artist.repository";
import { ArtistsService } from "./artist.service";

@Module({
    imports: [TypeOrmModule.forFeature([Artists, Tracks])],
    controllers: [ArtistsController],
    providers: [ArtistsService],
    exports: [ArtistsService]
})
export class ArtistsModule {

}