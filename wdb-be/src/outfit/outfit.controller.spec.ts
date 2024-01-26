import { Test, TestingModule } from '@nestjs/testing';
import { OutfitController } from './outfit.controller';
import { OutfitService } from './outfit.service';

describe('OutfitController', () => {
  let controller: OutfitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OutfitController],
      providers: [OutfitService],
    }).compile();

    controller = module.get<OutfitController>(OutfitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
