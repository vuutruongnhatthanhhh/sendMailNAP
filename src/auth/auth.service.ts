import { Injectable, UnauthorizedException } from '@nestjs/common';
import { comparePasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ChangePasswordAuthDto,
  ChangePasswordProfileDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(user: any) {
    const payload = { username: user.email, sub: user._id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRED'),
    });
    return {
      user: {
        email: user.email,
        // _id: user._id,
        // name: user.name,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const newAccessToken = this.jwtService.sign(
        { username: payload.username, sub: payload.sub, role: payload.role },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED'),
        },
      );

      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
      );
    }
  }
}
