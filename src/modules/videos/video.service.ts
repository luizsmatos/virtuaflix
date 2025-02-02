import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma.service';

@Injectable()
export class VideoService {
  constructor(private readonly prismaService: PrismaService) {}

  uploadFile(files: Record<string, Express.Multer.File[]>) {
    console.log(files);
    return {
      message: 'Video uploaded successfully',
    };
  }
}
