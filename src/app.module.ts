import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YoutubeGrabberModule } from './youtube-grabber/youtube-grabber.module';

@Module({
  imports: [YoutubeGrabberModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
