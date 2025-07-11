import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  registerUser(dto: RegisterUserDto) {
    return 'register Parent from service';
  }
}
