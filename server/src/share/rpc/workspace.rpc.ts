import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RPCConfig } from 'src/share/config/config.interface';
import { Workspace } from '../data-model';
import { IWorkspaceRPC } from 'src/share/interface';

@Injectable()
export class WorkspaceRPCClient implements IWorkspaceRPC {
  private readonly url: string;

  constructor(private configService: ConfigService) {
    const securityConfig = this.configService.get<RPCConfig>('rpc');
    this.url = securityConfig?.workspacesURL || '';
  }

  async create(name: string, ownerId: string): Promise<Workspace | null> {
    try {
      const { data } = await axios.post(`${this.url}/rpc/workspaces`, {
        name,
        ownerId,
      });
      const workspace = data.data;
      if (workspace) return workspace;
      return null;
    } catch (error) {
      return null;
    }
  }
}
