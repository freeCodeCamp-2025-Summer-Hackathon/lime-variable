import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,

  ) { }


  registerUser(dto: RegisterUserDto) {
    return 'register User response from service';
  }
}
