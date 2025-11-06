import { Test, TestingModule } from '@nestjs/testing';
import { OrganizacaoController } from './organizacao.controller';

describe('OrganizacaoController', () => {
  let controller: OrganizacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizacaoController],
    }).compile();

    controller = module.get<OrganizacaoController>(OrganizacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
