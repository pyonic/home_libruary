import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Albums } from "./albums.repository";
import { AlbumsService } from "./album.service";
import { Tracks } from "../tracks/tracks.repository";
import { AlbumsController } from "./albums.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Albums, Tracks])],
    controllers: [AlbumsController],
    providers: [AlbumsService],
    exports: [AlbumsService]
})
export class AlbumsModule {
    // Hello
}