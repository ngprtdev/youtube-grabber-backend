import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeGrabberService } from './youtube-grabber.service';

describe('YoutubeGrabberService', () => {
  let service: YoutubeGrabberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YoutubeGrabberService],
    }).compile();

    service = module.get<YoutubeGrabberService>(YoutubeGrabberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
