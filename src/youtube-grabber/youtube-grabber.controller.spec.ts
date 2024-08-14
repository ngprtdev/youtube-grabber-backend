import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeController } from './youtube-grabber.controller';

describe('YoutubeGrabberController', () => {
  let controller: YoutubeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YoutubeController],
    }).compile();

    controller = module.get<YoutubeController>(YoutubeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
