import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ITokenProvider, Token, TokenPayload } from '../interface';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/share/config/config.interface';

@Injectable()
export class JwtTokenService implements ITokenProvider {
  private readonly secretKey: string;
  private readonly expiresIn: string | number;
  private readonly refreshSecretKey: string;
  private readonly refreshIn: string;
  constructor(private readonly configService: ConfigService) {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    this.secretKey = configService.get<string>('JWT_ACCESS_SECRET');
    this.refreshSecretKey = configService.get<string>('JWT_REFRESH_SECRET');
    this.expiresIn = securityConfig.expiresIn;
    this.refreshIn = securityConfig.refreshIn;
  }

  async generateToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
  }

  async generateRefreshToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, this.refreshSecretKey, {
      expiresIn: this.refreshIn,
    });
  }

  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.secretKey) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.refreshSecretKey) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  async generateTokens(payload: TokenPayload): Promise<Token> {
    return {
      accessToken: await this.generateToken(payload),
      refreshToken: await this.generateRefreshToken(payload),
    };
  }
}
