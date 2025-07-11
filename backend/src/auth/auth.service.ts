import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) { }

  async registerUser(payload: RegisterUserDto) {
    const hashedPassword = await argon.hash(payload.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          name: payload.name,
          passwordHash: hashedPassword,
          role: 'PARENT',
          email: payload.email,
        }
      });

      const token = await this.generateAccessToken(user.id, user.email);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        access_token: token
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Credentials taken: Email ${payload.email} already used`,
        );
      }
      throw new Error(error as any);
    }
  }

  async generateAccessToken(
    userId: string,
    email: string,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET') as string;

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '2h',
      secret: secret,
    });

    return token;
  }
}
