import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { ViaCepService } from './viacep.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ViacepService', () => {
  let service: ViaCepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViaCepService],
    }).compile();

    service = module.get<ViaCepService>(ViaCepService);
  });

  it('deve retornar dados do CEP corretamente', async () => {
    const mockData = {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
    };

    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await service.viaCep('01001-000');
    expect(result).toEqual(mockData);
  });

  it('deve lançar InternalServerErrorException se a API falhar', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Erro de conexão'));

    await expect(service.viaCep('99999-999')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
