import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterUserDto } from './dto';
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

  async login({ email, password }: LoginDto) {

    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passMatched = await argon.verify(user.passwordHash, password);
    if (!passMatched) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const token = await this.generateAccessToken(user.id, user.email);

    return {
      'access_token': token
    };
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
