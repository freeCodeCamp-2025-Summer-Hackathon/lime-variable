import { Module } from '@nestjs/common';
import { FamiliesController } from './families.controller';
import { FamiliesService } from './families.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [FamiliesController],
  providers: [FamiliesService, PrismaService, UsersService],
})
export class FamiliesModule {}
