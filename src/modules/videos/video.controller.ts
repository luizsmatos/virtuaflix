import crypto from 'node:crypto';
import path from 'node:path';

import {
  Controller,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
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
  uploadFile(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'video/mp4',
        })
        .addFileTypeValidator({
          fileType: 'image/jpeg',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Record<string, Express.Multer.File[]>,
  ) {
    return this.videoService.uploadFile(files);
  }
}
