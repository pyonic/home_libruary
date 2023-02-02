import { IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTrackDto {
    @IsOptional()
    @IsString()
    artistId: string | null;

    @IsOptional()
    @IsString()
    albumId: string | null;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    duration: number;
}