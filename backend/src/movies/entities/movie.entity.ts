export class Movie {
  id: number;
  nombre: string;
  imagen: string;
  director: string | null;
  anio: number | null;
  genero: string | null;
  sinopsis: string | null;
  createdAt: Date;
  updatedAt: Date;
}
