import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { YoutubeGrabberService } from './youtube-grabber.service';

@Controller('youtube-thumbnail')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeGrabberService) {}

  @Post('download')
  async downloadThumbnail(
    @Body() body: { url: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { url } = body;

    try {
      const stream = await this.youtubeService.downloadThumbnail(url);

      res.set({
        'Content-Disposition': 'attachment; filename=thumbnail.jpg',
        'Content-Type': 'image/jpeg',
      });

      return new StreamableFile(stream);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  async getThumbnail(@Body() body: { url: string }) {
    try {
      const thumbnails = await this.youtubeService.getThumbnails(body.url);
      return { thumbnails };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
