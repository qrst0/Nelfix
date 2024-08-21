import { Test, TestingModule } from '@nestjs/testing';
import { ShascController } from './shasc.controller';

describe('ShascController', () => {
  let controller: ShascController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShascController],
    }).compile();

    controller = module.get<ShascController>(ShascController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
