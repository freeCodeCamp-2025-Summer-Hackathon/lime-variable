import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'generated/prisma';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ChoresService } from './chores.service';
import { CreateChoreDto } from './dto/create-chore.dto';
import { UpdateChoreDto } from './dto/update-chore.dto';

@UseGuards(JwtGuard)
@Controller('chores')
export class ChoresController {
  constructor(private readonly choresService: ChoresService) {}

  @Post()
  create(@Body() createChoreDto: CreateChoreDto, @GetUser() user: User) {
    return this.choresService.create(createChoreDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.choresService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') choreId: string, @GetUser('id') userId: string) {
    return this.choresService.findOne(userId, choreId);
  }

  @Patch(':id')
  update(
    @Param('id') choreId: string,
    @Body() updateChoreDto: UpdateChoreDto,
    @GetUser('id') userId: string,
  ) {
    return this.choresService.update(choreId, updateChoreDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.choresService.remove(id, user);
  }
}
