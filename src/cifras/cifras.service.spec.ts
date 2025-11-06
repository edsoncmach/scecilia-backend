import { Test, TestingModule } from '@nestjs/testing';
import { CifrasService } from './cifras.service';

describe('CifrasService', () => {
  let service: CifrasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CifrasService],
    }).compile();

    service = module.get<CifrasService>(CifrasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
