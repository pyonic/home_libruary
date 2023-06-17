import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Tracks } from '../tracks/tracks.repository';
import { Favorites } from '../favorites/favorites.repository';
import { Albums } from '../albums/albums.repository';

@Entity()
export class Artists {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => Albums, (album) => album.artist)
  albums: Albums[];

  @OneToMany(() => Tracks, (track) => track.artist)
  tracks: Tracks[];

  @ManyToMany(() => Favorites, (favorite) => favorite.favoriteArtists)
  favoriteBy: Favorites[];
}
