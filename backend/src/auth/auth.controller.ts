import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterResponseDto, RegisterUserDto } from './dto/register-user.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ============================================================================
  // REGISTER ENDPOINT - POST
  // ============================================================================

  @Post('register-user')
  @ApiOperation({
    summary: 'Register new user(Parent)',
    description: 'Creates a new user account',
  })
  @ApiBody({
    description: 'User creation data',
    type: RegisterUserDto,
  })
  @ApiCreatedResponse({
    description: 'The account created successfully.',
  })
  @ApiConflictResponse({ description: 'Email already exists.' })
  registerUser(@Body() dto: RegisterUserDto): Promise<RegisterResponseDto> {
    return this.authService.registerUser(dto);
  }

  // ============================================================================
  // LOGIN ENDPOINT - POST
  // ============================================================================

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user.',
    description: 'Account login.',
  })
  @ApiBody({ description: 'Login data', type: LoginDto })
  @ApiOkResponse({ description: 'Login successful.' })
  @ApiNotFoundResponse({ description: 'Account not found.' })
  @ApiForbiddenResponse({ description: 'Credentials incorrect' })
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }
}
