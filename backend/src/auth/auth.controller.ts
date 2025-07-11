import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterParentDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register-parent')
  registerParent(@Body() dto: RegisterParentDto) {
    return this.authService.registerParent(dto);
  }
}
