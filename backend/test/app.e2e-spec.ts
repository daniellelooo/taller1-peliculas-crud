import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect((res) => {
        expect(res.body.nombre).toBe('API de Peliculas');
      });
  });

  it('/api/movies (GET) responde con data y meta', () => {
    return request(app.getHttpServer())
      .get('/api/movies')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.meta).toBeDefined();
      });
  });

  it('/api/movies (POST) sin token responde 401', () => {
    return request(app.getHttpServer())
      .post('/api/movies')
      .send({ nombre: 'Test', imagen: 'https://example.com/a.jpg' })
      .expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
