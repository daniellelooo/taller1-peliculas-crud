import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      nombre: 'API de Peliculas',
      version: '1.0.0',
      endpoints: [
        'POST   /api/auth/register',
        'POST   /api/auth/login',
        'GET    /api/auth/me            (JWT)',
        'GET    /api/movies?search=&page=&limit=',
        'GET    /api/movies/:id',
        'POST   /api/movies             (JWT)',
        'PATCH  /api/movies/:id         (JWT)',
        'DELETE /api/movies/:id         (JWT)',
      ],
    };
  }
}
