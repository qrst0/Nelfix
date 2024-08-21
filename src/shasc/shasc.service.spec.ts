import { Test, TestingModule } from '@nestjs/testing';
import { ShascService } from './shasc.service';

describe('ShascService', () => {
  let service: ShascService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShascService],
    }).compile();

    service = module.get<ShascService>(ShascService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
