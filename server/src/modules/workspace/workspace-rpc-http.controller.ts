import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { WORKSPACE_SERVICE } from 'src/modules/workspace/workspace.di-tokens';
import {
  CreateWorkspaceDTO,
  CreateWorkspaceRPCDTO,
} from 'src/modules/workspace/workspace.dto';
import { IWorkspaceService } from 'src/modules/workspace/workspace.port';

@Controller('rpc/workspaces')
export class WorkspaceRPCHttpController {
  constructor(
    @Inject(WORKSPACE_SERVICE)
    private readonly workspaceService: IWorkspaceService,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  async createWorkspace(@Body() dto: CreateWorkspaceRPCDTO) {
    const data = await this.workspaceService.createWorkspace(
      dto.name,
      dto.ownerId,
    );
    return { data };
  }
}
