import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from '../src/app.module'; // or import { ChoresModule } if testing in isolation

let app: INestApplication;
let prisma: PrismaService;
export const initApp = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.init();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.init();
  await app.listen(3333);

  prisma = app.get(PrismaService);
  await prisma.cleanDB();

  pactum.request.setBaseUrl(`http://localhost:3333`);

  return app;
};
export const closeApp = async () => {
  if (app) {
    await app.close();
  }
};

export const getApp = () => {
  if (!app) {
    throw new Error('App not initialized. Call initApp() first.');
  }
  return app;
};
