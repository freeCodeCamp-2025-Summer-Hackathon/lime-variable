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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User, UserRole } from 'generated/prisma';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

@ApiTags('users')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // ============================================================================
  // CREATE USER(ADD MEMBER IN FAMILY) - POST
  // ============================================================================

  @Post()
  @Roles(UserRole.PARENT)
  @ApiOperation({
    summary: 'Create new User',
    description: 'Creates a new User with provided details',
  })
  @ApiBody({
    description: 'Add Family member data',
    type: CreateUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Only Parents can add family member',
  })
  @ApiCreatedResponse({ description: 'User account created successfully.' })
  create(@Body() dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.create(dto);
  }

  // ============================================================================
  // RETRIEVE ALL FAMILY MEMBERS - GET
  // ============================================================================

  @Get(':familyId')
  @ApiOperation({
    summary: 'Get users of a family',
    description: 'Retrieves all users of a family',
  })
  @ApiOkResponse({ description: 'Got family members successfully' })
  @ApiNotFoundResponse({ description: 'Users not found' })
  getFamilyMembers(
    @Param('familyId', ParseUUIDPipe) familyId: string,
  ): Promise<Omit<User, 'passwordHash'>[]> {
    return this.usersService.getFamilyMembers(familyId);
  }

  // ============================================================================
  // RETRIEVE SINGLE FAMILY MEMBER - GET
  // ============================================================================

  @Get(':id')
  @ApiOperation({
    summary: 'Get one user',
    description: 'Retrieve single user details',
  })
  @ApiOkResponse({ description: 'User data fetched successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.findOne(id);
  }

  // ============================================================================
  // UPDATE FAMILY MEMBER - PATCH
  // ============================================================================

  @Patch(':familyId/:userId')
  @ApiOperation({
    summary: 'Updates user of a family',
    description: 'Update user data in the family',
  })
  @ApiBody({
    description: 'Update user data',
    type: UpdateUserDto,
  })
  @ApiOkResponse({ description: 'User account updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Family or user not found' })
  updateFamilyMember(
    @GetUser('id') currentUserId: string,
    @GetUser('role') currentUserRole: UserRole,
    @Param() params: { familyId: string; userId: string },
    @Body() dto: UpdateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.updateFamilyMember(
      currentUserId,
      currentUserRole,
      params.familyId,
      params.userId,
      dto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNotFoundResponse({ description: 'Account not found.' })
  @ApiUnauthorizedResponse({
    description: 'Contact your parent to delete your account',
  })
  @ApiForbiddenResponse({
    description: "You can't delete other parent's account",
  })
  @ApiNoContentResponse({ description: 'Account deleted successfully.' })
  remove(
    @GetUser('role') currentUserRole: UserRole,
    @Param('id') deleteId: string,
  ): Promise<void> {
    return this.usersService.remove(currentUserRole, deleteId);
  }
}

// todo when child is sending wrong role, call forbidden before bad request
