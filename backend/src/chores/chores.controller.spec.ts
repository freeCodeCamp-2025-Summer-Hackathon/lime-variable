import { Test, TestingModule } from '@nestjs/testing';
import { ChoresController } from './chores.controller';
import { ChoresService } from './chores.service';

describe('ChoresController', () => {
  let controller: ChoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChoresController],
      providers: [ChoresService],
    }).compile();

    controller = module.get<ChoresController>(ChoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
