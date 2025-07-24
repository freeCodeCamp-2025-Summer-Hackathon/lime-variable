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
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { Request } from 'express';

@ApiTags('users')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // ============================================================================
  //  POST /users  only PARENT can create
  // ============================================================================

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.PARENT)
  @ApiOperation({
    summary: 'Create new User',
    description: 'Creates a new User with provided details',
  })
  @ApiBody({
    description: 'Add Family member data',
    type: CreateUserDto,
    examples: {
      default: {
        summary: 'Example request',
        value: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'StrongPassword123!',
          role: UserRole.CHILD,
          familyId: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Only Parents can add family member',
  })
  @ApiCreatedResponse({ description: 'User account created successfully.' })
  create(@Body() dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.create(dto);
  }

  // ============================================================================
  //   GET /users/user/me
  // ============================================================================

  @Get('me')
  @ApiOperation({
    summary: 'Get user info',
    description: 'Retrieve user info',
  })
  getMe(@GetUser() user: AuthenticatedUser) {
    return this.usersService.getMe(user);
  }

  // ============================================================================
  //   GET /users/family/:familyId  only PARENT can get
  // ============================================================================
  @Get('family/:familyId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PARENT)
  @ApiOperation({
    summary: 'Get users of a family',
    description: 'Retrieves all users of a family',
  })
  @ApiParam({
    name: 'familyId',
    type: 'string',
    description: 'UUID of the family',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({ description: 'Got family members successfully' })
  @ApiNotFoundResponse({ description: 'Users not found' })
  getFamilyMembers(
    @Param('familyId', ParseUUIDPipe) familyId: string,
  ): Promise<Omit<User, 'passwordHash'>[]> {
    return this.usersService.getFamilyMembers(familyId);
  }

  // ============================================================================
  //  GET /users/user/:userId  any authenticated user can get
  // ============================================================================

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get one user',
    description: 'Retrieve single user details',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({ description: 'User data fetched successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  findOne(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.findOne(userId);
  }

  // ============================================================================
  //  PATCH /users/family/:familyId/user/:userId    any authenticated user can update
  // ============================================================================

  @Patch('family/:familyId/user/:userId')
  @ApiOperation({
    summary: 'Updates user of a family',
    description: 'Update user data in the family',
  })
  @ApiParam({
    name: 'familyId',
    type: 'string',
    description: 'UUID of the family',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'UUID of the user to update',
    example: '660e8400-e29b-41d4-a716-446655440111',
  })
  @ApiBody({
    description: 'Update user data',
    type: UpdateUserDto,
    examples: {
      default: {
        summary: 'Example update request',
        value: {
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
        },
      },
    },
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

  // ============================================================================
  //  DELETE /users/user/:userId    only PARENT can delete
  // ============================================================================

  @Delete('user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.PARENT)
  @ApiParam({
    name: 'userId',
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
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.usersService.remove(currentUserRole, userId);
  }
}
