import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { FamiliesService } from './families.service';
import { Family, UserRole } from 'generated/prisma';
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
  ApiOperation,
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

  // ============================================================================
  // CREATE FAMILY ENDPOINT - POST
  // ============================================================================

  @Post()
  @ApiOperation({
    summary: 'Create new family',
    description: 'Creates a new family with provided details',
  })
  @ApiBody({
    description: 'Create family data',
    type: CreateFamilyDto,
  })
  @ApiUnauthorizedResponse({ description: 'Only Parents are allowed.' })
  @ApiCreatedResponse({ description: 'Family created successfully.' })
  create(
    @GetUser('role') role: UserRole,
    @Body() dto: CreateFamilyDto,
  ): Promise<Family> {
    return this.familyService.create(role, dto);
  }

  // ============================================================================
  // READ FAMILY ENDPOINT - GET
  // ============================================================================

  @Get(':id')
  @ApiOperation({
    summary: 'Get family by ID',
    description: 'Retrieves a specific family by their unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Family ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Got family successfully.' })
  @ApiNotFoundResponse({ description: 'Family not found.' })
  findOne(@Param('id') id: string): Promise<Family> {
    return this.familyService.findOne(id);
  }

  // ============================================================================
  // UPDATE FAMILY ENDPOINT - PATCH
  // =================================================================

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'Family ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ description: 'Family update data' })
  @ApiOkResponse({ description: 'Family updated successfully.' })
  @ApiNotFoundResponse({ description: 'Family not found.' })
  @ApiUnauthorizedResponse({ description: 'Only Parents are allowed.' })
  update(
    @GetUser('role') role: UserRole,
    @Param('id') id: string,
    @Body() dto: UpdateFamilyDto,
  ): Promise<Family> {
    return this.familyService.update(role, id, dto);
  }

  // ============================================================================
  // DELETE FAMILY ENDPOINT - DELETE
  // =================================================================

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    description: 'Family ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiUnauthorizedResponse({ description: 'Only Parents are allowed.' })
  @ApiNotFoundResponse({ description: 'Family not found.' })
  @ApiNoContentResponse({ description: 'Family deleted successfully.' })
  remove(
    @GetUser('role') role: UserRole,
    @Param('id') id: string,
  ): Promise<void> {
    return this.familyService.remove(role, id);
  }
}
