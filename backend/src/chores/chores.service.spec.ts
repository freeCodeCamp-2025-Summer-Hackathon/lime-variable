import { Test, TestingModule } from '@nestjs/testing';
import { ChoresService } from './chores.service';

describe('ChoresService', () => {
  let service: ChoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChoresService],
    }).compile();

    service = module.get<ChoresService>(ChoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
