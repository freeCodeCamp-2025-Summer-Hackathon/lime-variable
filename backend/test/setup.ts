import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from '../src/app.module'; // or import { ChoresModule } if testing in isolation

let app: INestApplication;
export const initApp = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.init();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.init();
  await app.listen(3333);

  const prisma = app.get(PrismaService);
  await prisma.cleanDB();
  await prisma.seedDb();
  pactum.request.setBaseUrl(`http://localhost:3333`);

  return { app, prisma };
};
export const closeApp = async () => {
  if (app) {
    await app.close();
  }
};
