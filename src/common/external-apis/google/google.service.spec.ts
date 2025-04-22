import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { GoogleService } from './google.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GoogleService', () => {
  let service: GoogleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleService],
    }).compile();

    service = module.get<GoogleService>(GoogleService);
  });

  it('deve retornar coordenadas corretamente', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [
          {
            geometry: {
              location: {
                lat: -23.55052,
                lng: -46.633308,
              },
            },
          },
        ],
      },
    });

    const coords = await service.getCoords('Av.+Paulista,São+Paulo');

    expect(coords).toEqual({ lat: -23.55052, lng: -46.633308 });
  });

  it('deve lançar erro se a API do Google falhar', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Erro de conexão'));

    await expect(service.getCoords('Rua Inexistente')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
