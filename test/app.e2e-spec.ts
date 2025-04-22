import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

jest.setTimeout(20000);

describe('StoreController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/store (GET)', () => {
    it('Deve retornar um array de lojas', async () => {
      const response = await request(app.getHttpServer())
        .get('/store')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('/store/postalCode/:postalCode (GET)', () => {
    it('Deve retornar a loja mais proxima', async () => {
      const response = await request(app.getHttpServer())
        .get('/store/postalCode/01001-000')
        .expect(200);

      expect(response.body).toHaveProperty('name');
      expect(response.body.name).toEqual(expect.any(String));
    });

    it('Deve retornar 400 por cep nao encontrado', async () => {
      const response = await request(app.getHttpServer())
        .get('/store/postalCode/00000-000')
        .expect(400);

      expect(response.body.message).toEqual('cep não encontrado');
    });
  });

  describe('/store/id/:id (GET)', () => {
    it('Deve retornar a loja por id', async () => {
      const response = await request(app.getHttpServer())
        .get('/store/id/6807ce7b30678d166d9c6d32')
        .expect(200);

      expect(response.body).toHaveProperty('name');
      expect(response.body.name).toEqual(expect.any(String));
    });

    it('Deve retornar 404 por loja nao encontrada', async () => {
      const response = await request(app.getHttpServer())
        .get('/store/id/6807ce7b30678d166d9c6d31')
        .expect(404);

      expect(response.body.message).toEqual(
        'Loja com ID 6807ce7b30678d166d9c6d31 não encontrada',
      );
    });
  });

  describe('/store/state/:state (GET)', () => {
    it('Deve retornar a lojas por estado', async () => {
      const response = await request(app.getHttpServer())
        .get('/store/state/PE')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('Deve retornar 404 por loja nao encontrada', async () => {
      const response = await request(app.getHttpServer())
        .get('/store/state/AM')
        .expect(404);

      expect(response.body.message).toEqual(
        'Nenhuma loja encontrada no estado AM',
      );
    });
  });
});
