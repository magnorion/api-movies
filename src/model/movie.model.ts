import {IsInt, IsNotEmpty, IsNumber, IsString, Max, Min} from 'class-validator';

export class Movie {
    public id?: number;

    @IsInt()
    @IsNotEmpty()
    public year!: number;

    @IsString()
    @IsNotEmpty()
    public title!: string;

    @IsString()
    @IsNotEmpty()
    public studios!: string;

    @IsString()
    @IsNotEmpty()
    public producers!: string;

    @IsNumber()
    @Min(0)
    @Max(1)
    public winner!: number;
}
