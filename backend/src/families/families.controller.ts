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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('families')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('families')
export class FamiliesController {
  constructor(private familyService: FamiliesService) {}

  @Post()
  @ApiUnauthorizedResponse({ description: 'Only Parents are allowed.' })
  @ApiCreatedResponse({ description: 'Family created successfully.' })
  create(@GetUser('role') role: UserRole, @Body() dto: CreateFamilyDto) {
    return this.familyService.create(role, dto);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Got family successfully.' })
  @ApiNotFoundResponse({ description: 'Family not found.' })
  findOne(@Param('id') id: string) {
    return this.familyService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Family ID' })
  @ApiBody({ type: UpdateFamilyDto })
  @ApiUnauthorizedResponse({ description: 'Only Parents are allowed.' })
  @ApiOkResponse({ description: 'Family updated successfully.' })
  @ApiNotFoundResponse({ description: 'Family not found.' })
  update(
    @GetUser('role') role: UserRole,
    @Param('id') id: string,
    @Body() dto: UpdateFamilyDto,
  ) {
    return this.familyService.update(role, id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiUnauthorizedResponse({ description: 'Only Parents are allowed.' })
  @ApiNoContentResponse({ description: 'Family deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Family not found.' })
  remove(@GetUser('role') role: UserRole, @Param('id') id: string) {
    return this.familyService.remove(role, id);
  }
}
