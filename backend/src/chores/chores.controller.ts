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
  findAll() {
    return this.choresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.choresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChoreDto: UpdateChoreDto) {
    return this.choresService.update(+id, updateChoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.choresService.remove(+id);
  }
}
