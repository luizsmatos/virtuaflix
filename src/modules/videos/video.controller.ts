import crypto from 'node:crypto';
import path from 'node:path';

import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { VideoService } from './video.service';

@Controller()
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('videos')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'video',
          maxCount: 1,
        },
        {
          name: 'thumbnail',
          maxCount: 1,
        },
      ],
      {
        dest: path.join(process.cwd(), 'uploads'),
        storage: diskStorage({
          destination: path.join(process.cwd(), 'uploads'),
          filename: (_req, file, cb) => {
            return cb(
              null,
              `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname)}`,
            );
          },
        }),
      },
    ),
  )
  async uploadFile(
    @UploadedFiles()
    files: Record<string, Express.Multer.File[]>,
    @Body() body: { title: string; description: string },
  ) {
    const videoFile = files.video?.[0];
    const thumbnailFile = files.thumbnail?.[0];

    if (!videoFile || !thumbnailFile) {
      throw new BadRequestException(
        'Both video and thumbnail files are required.',
      );
    }

    const { title, description } = body;

    if (!title || !description) {
      throw new BadRequestException('Title and description are required.');
    }

    return this.videoService.uploadFile({
      title,
      description,
      videoUrl: videoFile.path,
      thumbnailUrl: thumbnailFile.path,
      sizeInKb: videoFile.size,
    });
  }
}
