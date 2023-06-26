import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'refresh_tokens' })
export class RefreshTokensRepository {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    token: string;
    
    @Column()
    login: string;
  }