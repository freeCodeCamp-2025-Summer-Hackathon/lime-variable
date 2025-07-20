import { INestApplication } from '@nestjs/common';
import { ChoreStatus } from 'generated/prisma';
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

  const fakeUuid = '11111111-1111-1111-1111-111111111111';
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
  describe('/chores GET', () => {
    describe('Success Cases', () => {
      it('should get all chores', () => {
        return pactum
          .spec()
          .get('/chores')
          .expectStatus(200)
          .expectJsonLike([
            {
              title: 'Test Chore',
              description: 'Seed chore for testing',
              points: 10,
              status: ChoreStatus.PENDING,
            },
            {
              title: 'Test Chore 2',
              description: 'Seed chore for testing 2',
              points: 10,
              status: ChoreStatus.PENDING,
            },
          ]);
      });
      it('should get one chore', async () => {
        const chore = await prisma.chore.findFirst();
        if (!chore) return;

        return pactum
          .spec()
          .get(`/chores/${chore.id}`)
          .expectStatus(200)
          .expectJsonMatch({
            id: chore.id,
            title: chore.title,
            description: chore.description,
            points: chore.points,
            status: chore.status,
            createdBy: chore.createdBy,
            assignedBy: chore.assignedBy,
            assignedTo: chore.assignedTo,
          });
      });
    });
    describe('Failure Cases', () => {
      it('should send not found status', async () => {
        return pactum.spec().get(`/chores/${fakeUuid}`).expectStatus(404);
      });
      it('should send not found status', async () => {
        pactum.request.removeDefaultHeaders();

        return pactum.spec().get(`/chores/${fakeUuid}`).expectStatus(401);
      });
    });
  });
  describe('/chores:id Update', () => {
    describe('Success Cases', () => {
      it('should update one chore', async () => {
        const chore = await prisma.chore.findFirst();
        if (!chore) return;

        return pactum
          .spec()
          .patch(`/chores/${chore.id}`)
          .withBody({
            title: 'changed title',
          })
          .expectStatus(200)
          .expectJsonMatch({
            id: chore.id,
            title: 'changed title',
            description: chore.description,
            points: chore.points,
            status: chore.status,
            createdBy: chore.createdBy,
            assignedBy: chore.assignedBy,
            assignedTo: chore.assignedTo,
          });
      });
    });
    describe('Failure Cases', () => {
      // TODO: Need to be fixed in the second iteration
      it.skip('Need attention:should not update id', async () => {
        const chore = await prisma.chore.findFirst();
        if (!chore) throw new Error();

        return pactum
          .spec()
          .patch(`/chores/${chore.id}`)
          .withBody({
            id: fakeUuid,
          })
          .expectStatus(401)
          .expectJsonMatch({
            id: chore.id,
            title: chore.title,
            description: chore.description,
            points: chore.points,
            status: chore.status,
            createdBy: chore.createdBy,
            assignedBy: chore.assignedBy,
            assignedTo: chore.assignedTo,
          });
      });
    });
  });
  // TODO: add failure case if the delete was initiated by user who didnot created it
  describe('/chores:id Remove', () => {
    it('should delete a chore', async () => {
      const chore = await prisma.chore.findFirst();
      if (!chore) throw new Error();
      await pactum.spec().delete(`/chores/${chore.id}`);
      return pactum.spec().get(`/chores/${chore.id}`).expectStatus(404);
    });
  });
});
