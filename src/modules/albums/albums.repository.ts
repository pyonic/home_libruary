import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Artists } from '../artists/artist.repository';
import { Tracks } from '../tracks/tracks.repository';
import { Favorites } from '../favorites/favorites.repository';

@Entity()
export class Albums {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => Artists, (artist) => artist.albums)
  @JoinColumn({ name: 'artistId' })
  artist: Artists;

  @OneToMany(() => Tracks, (track) => track.album)
  tracks: Tracks[];

  @ManyToMany(() => Favorites, (favorite) => favorite.favoriteAlbums)
  favoriteBy: Favorites[];
}
