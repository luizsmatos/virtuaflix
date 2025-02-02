import { Module } from '@nestjs/common';
import { PrismaService } from '@src/prisma.service';

import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [],
  controllers: [VideoController],
  providers: [PrismaService, VideoService],
  exports: [],
})
export class VideoModule {}
