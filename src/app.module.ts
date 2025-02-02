import { Module } from '@nestjs/common';

import { VideoModule } from './modules/videos/video.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [VideoModule],
  providers: [PrismaService],
})
export class AppModule {}
