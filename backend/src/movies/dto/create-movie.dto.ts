import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(120)
  nombre: string;

  @IsUrl({}, { message: 'La imagen debe ser una URL valida' })
  imagen: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  director?: string;

  @IsOptional()
  @IsInt()
  @Min(1888)
  @Max(2100)
  anio?: number;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  genero?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  sinopsis?: string;
}
