import * as fs from 'node:fs';
import { Server } from 'node:http';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { VideoModule } from '@src/modules/videos/video.module';
import { PrismaService } from '@src/prisma.service';
import request from 'supertest';

describe('VideoController (e2e)', () => {
  let app: INestApplication<Server>;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [VideoModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prismaService = moduleRef.get(PrismaService);
  });

  beforeEach(() => {
    vitest
      .useFakeTimers({ shouldAdvanceTime: true })
      .setSystemTime(new Date('2023-01-01T00:00:00.000Z'));
  });

  afterAll(async () => {
    await app.close();
    fs.rmSync('./uploads', { recursive: true, force: true });
  });

  afterEach(async () => {
    await prismaService.video.deleteMany();
  });

  describe('/videos (POST)', () => {
    it('should upload video', async () => {
      const video = {
        title: 'Test Video',
        description: 'This is a test video',
        videoUrl: 'uploads/test.mp4',
        thumbnailUrl: 'uploads/test.jpg',
        sizeInKb: 1_430_145,
        duration: 100,
      };

      const response = await request(app.getHttpServer())
        .post('/videos')
        .attach('video', './test/fixtures/sample.mp4')
        .attach('thumbnail', './test/fixtures/sample.jpg')
        .field('title', video.title)
        .field('description', video.description);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(
        expect.objectContaining({
          title: video.title,
          description: video.description,
          url: expect.stringContaining('mp4') as string,
          thumbnailUrl: expect.stringContaining('jpg') as string,
          sizeInKb: video.sizeInKb,
          duration: video.duration,
        }),
      );

      console.log(response.body);
    });
  });
});
