import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tracks } from './tracks.repository';
import { TracksService } from './tracks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tracks])],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
