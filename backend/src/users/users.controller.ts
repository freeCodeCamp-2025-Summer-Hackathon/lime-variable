import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User, UserRole } from 'generated/prisma';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

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
  updateFamilyMember(
    @Param() params: { familyId: string; userId: string },
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateFamilyMember(
      params.familyId,
      params.userId,
      dto,
    );
  }

  @Delete(':id')
  remove() {
    return 'user deleted';
  }
}
