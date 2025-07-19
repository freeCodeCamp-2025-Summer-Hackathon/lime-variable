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
import { ApprovalChoreDto } from './dto/approve-chore.dto';
import { AssignChoreDto } from './dto/assign-chore.dto';
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

  @Patch(':id/assign')
  assign(
    @Param('id') choreId: string,
    @Body('assignedTo') userToBeAssigned: AssignChoreDto['assignedTo'],
    @GetUser() user: User,
  ) {
    return this.choresService.assign(choreId, userToBeAssigned, user);
  }

  @Patch(':id/submit')
  submit(@Param('id') choreId: string, @GetUser('id') userId: string) {
    return this.choresService.submit(choreId, userId);
  }
  @Patch(':id/approval')
  approve(
    @Param('id') choreId: string,
    @Body('status') approvalChoreDto: ApprovalChoreDto['status'],
    @GetUser() user: User,
  ) {
    return this.choresService.approve(choreId, user, approvalChoreDto);
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
