import { ConfigService } from '@nestjs/config';
import { IUserRPC } from './workspace.port';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RPCConfig } from 'src/share/config/config.interface';

@Injectable()
export class UserRPC implements IUserRPC {
  private readonly url: string;

  constructor(private configService: ConfigService) {
    const securityConfig = this.configService.get<RPCConfig>('rpc');
    this.url = securityConfig?.userURL || '';
  }

  async updateManyDefaultWorkspace(dto: {
    oldSlug: string;
    slug: string;
  }): Promise<boolean> {
    try {
      const { data } = await axios.post(
        `${this.url}/rpc/update-default-workspace`,
        dto,
      );
      const result = data.data;
      if (result) return result as boolean;
      return false;
    } catch (error) {
      return false;
    }
  }
}
