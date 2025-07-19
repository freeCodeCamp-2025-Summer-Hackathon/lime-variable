import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@ApiTags('users')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  // ============================================================================
  // CREATE FAMILY ENDPOINT - POST
  // ============================================================================

  @Post()
  @ApiOperation({
    summary: 'Create new User',
    description: 'Creates a new User with provided details',
  })
  @ApiUnauthorizedResponse({ description: 'Only Parents are allowed.' })
  @ApiCreatedResponse({ description: 'Family created successfully.' })
  create() {
    return 'User created';
  }

  @Get()
  findAll() {
    return 'All users';
  }

  @Get(':id')
  findOne() {
    return 'found one';
  }

  @Patch(':id')
  update() {
    return 'user Updated';
  }

  @Delete(':id')
  remove() {
    return 'user deleted';
  }
}
