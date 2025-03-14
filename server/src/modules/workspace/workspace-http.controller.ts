import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { IWorkspaceService } from './workspace.port';
import { WORKSPACE_SERVICE } from './workspace.di-tokens';
import { Inject } from '@nestjs/common';
import {
  RemoteAuthGuard,
  RemoteAuthGuardOptional,
} from '../../share/guards/auth.guard';
import {
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
  JoinWorkspaceDTO,
  UpdateUserRoleDTO,
} from './workspace.dto';
import { ReqWithRequester } from 'src/share';

@Controller('workspaces')
export class WorkspaceHttpController {
  constructor(
    @Inject(WORKSPACE_SERVICE)
    private readonly workspaceService: IWorkspaceService,
  ) {}

  @Post()
  @UseGuards(RemoteAuthGuard)
  async createWorkspace(@Body() dto: CreateWorkspaceDTO, @Req() req: any) {
    const data = await this.workspaceService.createWorkspace(
      dto.name,
      req.requester.sub,
    );

    return { data };
  }

  @Get()
  @UseGuards(RemoteAuthGuard)
  async getUserWorkspaces(@Req() req: ReqWithRequester) {
    const data = await this.workspaceService.getUserWorkspaces(
      req.requester.sub,
    );
    return { data };
  }

  @Get(':id')
  @UseGuards(RemoteAuthGuard)
  async getWorkspace(@Param('id') id: string) {
    const data = await this.workspaceService.getWorkspace(id);

    return { data };
  }

  @Get(':slug/exists')
  @UseGuards(RemoteAuthGuardOptional)
  async getWorkspaceExists(@Param('slug') slug: string) {
    const data = await this.workspaceService.getWorkspaceBySlug(slug);
    return { data: !!data?.id };
  }

  @Put(':id')
  @UseGuards(RemoteAuthGuard)
  async updateWorkspace(
    @Param('id') id: string,
    @Body() dto: UpdateWorkspaceDTO,
  ) {
    await this.workspaceService.updateWorkspace(id, dto);
    return {
      data: true,
    };
  }

  @Delete(':id')
  @UseGuards(RemoteAuthGuard)
  async deleteWorkspace(@Param('id') id: string) {
    await this.workspaceService.deleteWorkspace(id);
    return { data: true };
  }

  @Post(':id/invite')
  @UseGuards(RemoteAuthGuard)
  async inviteUser(@Param('id') id: string) {
    const data = await this.workspaceService.generateInviteCode(id);
    return { data };
  }

  @Post('join')
  @UseGuards(RemoteAuthGuard)
  async joinWorkspace(@Body() dto: JoinWorkspaceDTO, @Req() req: any) {
    const data = await this.workspaceService.joinWorkspace(
      dto.inviteCode,
      req.requester.sub,
    );

    return { data };
  }

  @Delete(':id/users/:userId')
  @UseGuards(RemoteAuthGuard)
  async removeUser(@Param('id') id: string, @Param('userId') userId: string) {
    await this.workspaceService.removeUser(id, userId);
    return { data: true };
  }

  @Put(':id/users/:userId/role')
  @UseGuards(RemoteAuthGuard)
  async updateUserRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateUserRoleDTO,
  ) {
    await this.workspaceService.updateUserRole(id, userId, dto.role);

    return { data: true };
  }
}
