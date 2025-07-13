import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'generated/prisma';

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
}
