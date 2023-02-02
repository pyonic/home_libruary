import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTrackDto {
    artistId: string | null;
    albumId: string | null;
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    duration: number;
}