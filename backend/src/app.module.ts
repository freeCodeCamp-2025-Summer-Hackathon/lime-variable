import { Module } from '@nestjs/common';
import { ChoresModule } from './chores/chores.module';

@Module({
  imports: [ChoresModule],
})
export class AppModule {}
