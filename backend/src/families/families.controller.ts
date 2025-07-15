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
import { UserRole } from 'generated/prisma';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('families')
export class FamiliesController {
  constructor(private familyService: FamiliesService) {}

  @Post()
  create(@GetUser('role') role: UserRole, @Body() dto: CreateFamilyDto) {
    return this.familyService.create(role, dto);
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
  update(
    @GetUser('role') role: UserRole,
    @Param('id') id: string,
    dto: UpdateFamilyDto,
  ) {
    return this.familyService.update(role, id, dto);
  }

  @Delete(':id')
  remove(@GetUser('role') role: UserRole, @Param('id') id: string) {
    return this.familyService.remove(role, id);
  }
}
