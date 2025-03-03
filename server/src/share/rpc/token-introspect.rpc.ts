import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RPCConfig } from 'src/share/config/config.interface';
import { ITokenIntrospect, TokenIntrospectResult } from 'src/share/interface';

@Injectable()
export class TokenIntrospectRPCClient implements ITokenIntrospect {
  private readonly url: string;

  constructor(private configService: ConfigService) {
    const securityConfig = this.configService.get<RPCConfig>('rpc');
    this.url = securityConfig.introspectURL;
  }

  async introspect(token: string): Promise<TokenIntrospectResult> {
    try {
      const { data } = await axios.post(`${this.url}`, { token });
      const { sub, role } = data.data;
      return {
        payload: { sub, role },
        isOk: true,
      };
    } catch (error) {
      return {
        payload: null,
        error: error as Error,
        isOk: false,
      };
    }
  }
}
