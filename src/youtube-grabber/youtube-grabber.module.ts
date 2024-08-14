import { Module } from '@nestjs/common';
import { YoutubeController } from './youtube-grabber.controller';

@Module({
  controllers: [YoutubeController],
})
export class YoutubeGrabberModule {}
