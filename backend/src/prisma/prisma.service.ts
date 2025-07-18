import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { ChoreStatus, PrismaClient, UserRole } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  async cleanDB() {
    // ! MUST be in order bc of foreign key dependencies
    await this.$transaction([this.chore.deleteMany(), this.user.deleteMany()]);
  }
  async seedDb() {
    // Create a family
    const family = await this.family.create({
      data: {
        name: 'Test Family',
      },
    });

    // Create users
    const parent = await this.user.create({
      data: {
        name: 'Parent User',
        email: 'parent@example.com',
        passwordHash: await argon.hash('parentpassword'),
        role: UserRole.PARENT,
        points: 100,
        familyId: family.id,
      },
    });

    const child = await this.user.create({
      data: {
        name: 'Child User',
        email: 'child@example.com',
        passwordHash: await argon.hash('childpassword'),
        role: UserRole.CHILD,
        points: 50,
        familyId: family.id,
      },
    });

    // Create a chore assigned to the child
    await this.chore.createMany({
      data: [
        {
          title: 'Test Chore',
          description: 'Seed chore for testing',
          points: 10,
          status: ChoreStatus.PENDING,
          createdBy: parent.id,
          assignedBy: parent.id,
          assignedTo: child.id,
        },
        {
          title: 'Test Chore 2',
          description: 'Seed chore for testing 2',
          points: 10,
          status: ChoreStatus.PENDING,
          createdBy: parent.id,
          assignedBy: parent.id,
          assignedTo: child.id,
        },
      ],
    });
  }
}
