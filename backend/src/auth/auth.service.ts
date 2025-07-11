import { Injectable } from '@nestjs/common';
import { RegisterParentDto } from './dto';

@Injectable()
export class AuthService {
  registerParent(dto: RegisterParentDto) {
    return 'register Parent from service';
  }
}
