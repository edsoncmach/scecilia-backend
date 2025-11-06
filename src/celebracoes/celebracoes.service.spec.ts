import { Test, TestingModule } from '@nestjs/testing';
import { CelebracoesService } from './celebracoes.service';

describe('CelebracoesService', () => {
  let service: CelebracoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CelebracoesService],
    }).compile();

    service = module.get<CelebracoesService>(CelebracoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
