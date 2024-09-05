import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { Readable } from 'stream';

@Controller('youtube-thumbnail')
export class YoutubeController {
  @Post('download')
  async downloadThumbnail(
    @Body() body: { url: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { url } = body;

    try {
      if (!url || !url.startsWith('https://img.youtube.com/vi/')) {
        throw new BadRequestException('Invalid or empty thumbnail URL');
      }

      const response = await axios.get(url, { responseType: 'arraybuffer' });

      res.set({
        'Content-Disposition': 'attachment; filename=thumbnail.jpg',
        'Content-Type': 'image/jpeg',
      });

      const stream = Readable.from(response.data);
      return new StreamableFile(stream);
    } catch (error) {
      throw new BadRequestException('Failed to download the image.');
    }
  }

  @Post()
  async getThumbnail(@Body() body: { url: string }) {
    const videoId = this.extractVideoId(body.url);

    if (!videoId || !body.url.includes('https://www.youtube.com/watch?')) {
      throw new BadRequestException('Invalid or empty YouTube URL');
    }

    const thumbnailsTemplates = [
      {
        url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        text: 'Maximum Resolution',
        size: 'Size: 1280 x 720',
      },
      {
        url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        text: 'Standard Definition',
        size: 'Size: 640 x 480',
      },
      {
        url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        text: 'High Quality',
        size: 'Size: 480 x 360',
      },
      {
        url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        text: 'Medium Quality',
        size: 'Size: 320 x 180',
      },
      {
        url: `https://img.youtube.com/vi/${videoId}/0.jpg`,
        text: 'List Thumbnail',
        size: 'Size: 480 x 360',
      },
      {
        url: `https://img.youtube.com/vi/${videoId}/1.jpg`,
        text: 'Mini Thumbnail #1',
        size: 'Size: 120 x 90',
      },
      {
        url: `https://img.youtube.com/vi/${videoId}/2.jpg`,
        text: 'Mini Thumbnail #2',
        size: 'Size: 120 x 90',
      },
      {
        url: `https://img.youtube.com/vi/${videoId}/3.jpg`,
        text: 'Mini Thumbnail #3',
        size: 'Size: 120 x 90',
      },
    ];

    const thumbnailsGenerated = await Promise.all(
      thumbnailsTemplates.map(async (template) => {
        try {
          const response = await axios.head(template.url);
          if (response.status === 200) {
            return { ...template, error: null };
          } else {
            return { ...template, error: 'Image not found' };
          }
        } catch (error) {
          return { ...template, error: 'Image not found' };
        }
      }),
    );

    const validThumbnails = thumbnailsGenerated.filter(
      (thumbnail) => !thumbnail.error,
    );

    if (validThumbnails.length === 0) {
      throw new BadRequestException(
        'No valid thumbnails found. Check again the url.',
      );
    }

    return { thumbnails: thumbnailsGenerated };
  }

  private extractVideoId(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v');
    } catch (error) {
      return null;
    }
  }
}
