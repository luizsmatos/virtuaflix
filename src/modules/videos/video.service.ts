import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class VideoService {
  constructor(private readonly prismaService: PrismaService) {}

  async uploadFile(input: Input) {
    const newVideo = {
      id: randomUUID(),
      title: input.title,
      description: input.description,
      url: input.videoUrl,
      thumbnailUrl: input.thumbnailUrl,
      sizeInKb: input.sizeInKb,
      duration: input.duration || 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.prismaService.video.create({
      data: newVideo,
    });
  }
}

interface Input {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  sizeInKb: number;
  duration?: number;
}
