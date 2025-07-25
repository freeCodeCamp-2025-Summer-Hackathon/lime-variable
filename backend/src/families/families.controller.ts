import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { FamiliesService } from './families.service';
import { Family, UserRole } from 'generated/prisma';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
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
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

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
  @ApiCreatedResponse({ description: 'Family created successfully.' })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateFamilyDto,
  ): Promise<Family> {
    return this.familyService.create(user, dto);
  }

  // ============================================================================
  // READ ALL FAMILY ENDPOINT - GET
  // ============================================================================

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.PARENT)
  @ApiOperation({
    summary: 'Get families',
    description: 'Retrieves all specific family',
  })
  @ApiOkResponse({ description: 'Got families successfully' })
  @ApiNotFoundResponse({ description: 'Families not found' })
  findAll(): Promise<Family[]> {
    return this.familyService.findAll();
  }

  // ============================================================================
  // READ FAMILY ENDPOINT - GET
  // ============================================================================

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PARENT)
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
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Family> {
    return this.familyService.findOne(id);
  }

  // ============================================================================
  // UPDATE FAMILY ENDPOINT - PATCH
  // =================================================================

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PARENT)
  @ApiParam({
    name: 'id',
    description: 'Family ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ description: 'Family update data' })
  @ApiOkResponse({ description: 'Family updated successfully.' })
  @ApiNotFoundResponse({ description: 'Family not found.' })
  update(
    @GetUser('role') role: UserRole,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFamilyDto,
  ): Promise<Family> {
    return this.familyService.update(role, id, dto);
  }

  // ============================================================================
  // DELETE FAMILY ENDPOINT - DELETE
  // =================================================================

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.PARENT)
  @ApiParam({
    name: 'id',
    description: 'Family ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiUnauthorizedResponse({ description: 'Only Parents are allowed.' })
  @ApiNotFoundResponse({ description: 'Family not found.' })
  @ApiNoContentResponse({ description: 'Family deleted successfully.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.familyService.remove(id);
  }
}
