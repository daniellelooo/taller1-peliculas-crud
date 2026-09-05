import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('devuelve la informacion de la API', () => {
      const info = appController.getInfo();
      expect(info.nombre).toBe('API de Peliculas');
      expect(info.endpoints.length).toBeGreaterThan(0);
    });
  });
});
