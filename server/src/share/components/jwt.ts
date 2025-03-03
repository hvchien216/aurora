import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ITokenProvider, TokenPayload } from '../interface';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/share/config/config.interface';

@Injectable()
export class JwtTokenService implements ITokenProvider {
  private readonly secretKey: string;
  private readonly expiresIn: string | number;

  constructor(private readonly configService: ConfigService) {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    this.secretKey = configService.get<string>('JWT_ACCESS_SECRET');
    this.expiresIn = securityConfig.expiresIn;
  }

  async generateToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
  }

  // Aurora TODO: Implement generateRefreshToken method

  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.secretKey) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
