import { Body, Controller, HttpCode, Post } from '@nestjs/common';
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

  @Post('register-user')
  @ApiBody({ type: RegisterUserDto })
  @ApiOperation({
    summary: 'Register new user',
    description: 'Creates a new user account',
  })
  @ApiCreatedResponse({
    description: 'The account has been successfully created.',
    type: RegisterResponseDto,
  })
  @ApiConflictResponse({ description: 'Email already used.' })
  registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login successful.', type: LoginResponseDto })
  @ApiNotFoundResponse({ description: 'Account not found.' })
  @ApiForbiddenResponse({ description: 'Credentials incorrect' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
