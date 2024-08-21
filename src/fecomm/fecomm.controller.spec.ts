import { Test, TestingModule } from '@nestjs/testing';
import { FecommController } from './fecomm.controller';

describe('FecommController', () => {
  let controller: FecommController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FecommController],
    }).compile();

    controller = module.get<FecommController>(FecommController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
