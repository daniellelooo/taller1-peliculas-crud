import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import { QueryMoviesDto } from './dto/query-movies.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 8;

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMovieDto: CreateMovieDto) {
    return this.prisma.movie.create({ data: createMovieDto });
  }

  /** Listado con busqueda por nombre y paginacion. */
  async findAll(query: QueryMoviesDto) {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;
    const search = query.search?.trim();

    // En SQLite el operador `contains` se traduce a LIKE, que ya es
    // insensible a mayusculas/minusculas para caracteres ASCII.
    const where = search ? { nombre: { contains: search } } : {};

    const [data, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) {
      throw new NotFoundException(`No existe la pelicula con id ${id}`);
    }
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    await this.findOne(id);
    return this.prisma.movie.update({ where: { id }, data: updateMovieDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.movie.delete({ where: { id } });
    return { id, eliminado: true };
  }
}
