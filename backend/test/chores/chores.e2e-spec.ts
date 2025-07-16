import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { AuthService } from 'src/auth/auth.service';
import { ChoresModule } from 'src/chores/chores.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { closeApp, initApp } from 'test/setup';
describe('Chores', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const appInit = await initApp();
    app = appInit.app;
    prisma = appInit.prisma;

    const authService = app.get(AuthService);
    const token = await authService.login({
      email: 'parent@example.com',
      password: 'parentpassword',
    });
    pactum.request.setDefaultHeaders({
      Authorization: `Bearer ${token.access_token}`,
    });
  });

  afterEach(async () => {
    await closeApp();
  });

  it('module should be defined', () => {
    expect(app.get(ChoresModule)).toBeDefined();
  });

  describe('/chores POST', () => {
    const choreMockData = {
      title: 'hello',
      points: 10,
    };

    describe('Success Cases', () => {
      it('should create a chore', () => {
        return pactum
          .spec()
          .post('/chores')
          .withBody(choreMockData)
          .expectStatus(201)
          .expectJsonLike({
            title: 'hello',
            points: 10,
            status: 'PENDING',
            // the rest of the obj
            // ...
          });
      });
      it('should create a chore with assignedTo', async () => {
        const child = await prisma.user.findFirst({
          where: {
            role: 'CHILD',
          },
        });
        const choreMockDataWithAssignTo = {
          ...choreMockData,
          assignedTo: child!.id,
        };
        return pactum
          .spec()
          .post('/chores')
          .withBody(choreMockDataWithAssignTo)
          .expectStatus(201)
          .expectJsonLike({
            title: 'hello',
            points: 10,
            assignedTo: child!.id,
          });
      });
    });
    describe('Failure Cases', () => {
      it('should not create for the unauthenticated', () => {
        pactum.request.removeDefaultHeaders('Authorization');
        return pactum
          .spec()
          .post('/chores')
          .withBody(choreMockData)
          .expectStatus(401)
          .expectBody({
            message: 'Unauthorized',
            statusCode: 401,
          });
      });
      it('should not create for if assignedTo is not a user', () => {
        const fakeUuid = '11111111-1111-1111-1111-111111111111';
        const incorrectAssignedToMockData = {
          ...choreMockData,
          assignedTo: fakeUuid,
        };
        return pactum
          .spec()
          .post('/chores')
          .withBody(incorrectAssignedToMockData)
          .expectStatus(400)
          .expectBody({
            error: 'Bad Request',
            message: 'Assigned user not found',
            statusCode: 400,
          });
      });
    });
  });
});
