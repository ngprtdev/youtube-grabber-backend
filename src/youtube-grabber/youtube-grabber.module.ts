import { Module } from '@nestjs/common';
import { YoutubeController } from './youtube-grabber.controller';
import { YoutubeGrabberService } from './youtube-grabber.service';

@Module({
  controllers: [YoutubeController],
  providers: [YoutubeGrabberService],
})
export class YoutubeGrabberModule {}
