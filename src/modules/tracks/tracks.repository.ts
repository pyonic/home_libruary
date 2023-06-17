import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Artists } from '../artists/artist.repository';
import { Albums } from '../albums/albums.repository';

@Entity()
export class Tracks {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Artists, artist => artist.tracks)
  @JoinColumn({ name: "artistId" })
  artist: Artists;

  @ManyToOne(() => Albums, album => album.tracks)
  @JoinColumn({ name: "albumId" })
  album: Albums;

  @Column()
  artistId: string

  @Column()
  albumId: string

  @Column()
  duration: number;
}