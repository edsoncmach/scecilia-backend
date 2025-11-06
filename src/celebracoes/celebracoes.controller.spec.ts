import { Test, TestingModule } from '@nestjs/testing';
import { CelebracoesController } from './celebracoes.controller';

describe('CelebracoesController', () => {
  let controller: CelebracoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CelebracoesController],
    }).compile();

    controller = module.get<CelebracoesController>(CelebracoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
