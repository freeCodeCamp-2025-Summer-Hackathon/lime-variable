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
import { CreateFamilyDto } from './dto/create-family.dto';
import { FamiliesService } from './families.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { UserRole } from 'generated/prisma';
import { UpdateFamilyDto } from './dto/update-family.dto';

@UseGuards(JwtGuard)
@Controller('families')
export class FamiliesController {
  constructor(private familyService: FamiliesService) {}

  @Post()
  create(@Body() dto: CreateFamilyDto) {
    return this.familyService.create(dto);
  }

  @Get()
  findAll(@GetUser('role') role: UserRole) {
    return this.familyService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, dto: UpdateFamilyDto) {
    return this.familyService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.familyService.remove(id);
  }
}
