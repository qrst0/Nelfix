import { Test, TestingModule } from '@nestjs/testing';
import { FecommService } from './fecomm.service';

describe('FecommService', () => {
  let service: FecommService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FecommService],
    }).compile();

    service = module.get<FecommService>(FecommService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
