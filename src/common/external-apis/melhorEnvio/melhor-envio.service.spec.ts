import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { MelhorEnvioService } from './melhor-envio.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MelhorEnvioService', () => {
  let service: MelhorEnvioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MelhorEnvioService],
    }).compile();

    service = module.get<MelhorEnvioService>(MelhorEnvioService);
  });

  it('deve retornar dados da entrega corretamente', async () => {
    const mockData = [
      {
        name: 'PAC',
        price: '25.41',
        delivery_time: 7,
      },
      {
        name: 'SEDEX',
        price: '36.29',
        delivery_time: 3,
      },
    ];

    mockedAxios.post.mockResolvedValue({ data: mockData });

    const result = await service.getPreco('01001-000', '20040-030');
    expect(result).toEqual(mockData);
  });

  it('deve lançar InternalServerErrorException se a API falhar', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Erro de conexão'));

    await expect(service.getPreco('99999-999', '00000-000')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
