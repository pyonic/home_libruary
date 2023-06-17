import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Artists } from '../artists/artist.repository';
import { Albums } from '../albums/albums.repository';
import { Tracks } from '../tracks/tracks.repository';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { array: true, default: [] })
  artists: string[];

  @Column('uuid', { array: true, default: [] })
  albums: string[];

  @Column('uuid', { array: true, default: [] })
  tracks: string[];

  @ManyToMany(() => Artists)
  @JoinTable()
  favoriteArtists: Artists[];

  @ManyToMany(() => Albums)
  @JoinTable()
  favoriteAlbums: Albums[];

  @ManyToMany(() => Tracks)
  @JoinTable()
  favoriteTracks: Tracks[];
}
