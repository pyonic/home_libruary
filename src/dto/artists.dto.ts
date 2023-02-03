import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateArtistDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsNotEmpty()
    grammy: boolean
}