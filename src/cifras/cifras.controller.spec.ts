import { Test, TestingModule } from '@nestjs/testing';
import { CifrasController } from './cifras.controller';

describe('CifrasController', () => {
  let controller: CifrasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CifrasController],
    }).compile();

    controller = module.get<CifrasController>(CifrasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
