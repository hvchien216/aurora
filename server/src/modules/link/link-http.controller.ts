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
import { RemoteAuthGuard } from 'src/share/guards/auth.guard';
import { LINK_SERVICE, ILinkService } from './link.port';
import { CreateLinkDTO } from './link.model';
import { Inject } from '@nestjs/common';
import { ReqWithRequester } from 'src/share';

@Controller('links')
export class LinkHttpController {
  constructor(
    @Inject(LINK_SERVICE)
    private readonly linkService: ILinkService,
  ) {}

  @Post()
  @UseGuards(RemoteAuthGuard)
  async createLink(@Body() dto: CreateLinkDTO, @Req() req: ReqWithRequester) {
    const data = await this.linkService.createLink(dto, req.requester.sub);
    return { data };
  }

  @Get(':id')
  @UseGuards(RemoteAuthGuard)
  async getLink(@Param('id') id: string) {
    const data = await this.linkService.getLink(id);
    return { data };
  }

  @Get('key/:key')
  async getLinkByKey(@Param('key') key: string) {
    const data = await this.linkService.getLinkByKey(key);
    await this.linkService.recordClick(data.id);
    return { data };
  }

  // TODO: add pagination
  @Get('workspace/:workspaceId')
  @UseGuards(RemoteAuthGuard)
  async getWorkspaceLinks(
    @Param('workspaceId') workspaceId: string,
    @Req() req: ReqWithRequester,
  ) {
    const data = await this.linkService.getWorkspaceLinks(
      workspaceId,
      req.requester.sub,
    );
    return { data };
  }

  @Put(':id')
  @UseGuards(RemoteAuthGuard)
  async updateLink(
    @Param('id') id: string,
    @Body() dto: Partial<CreateLinkDTO>,
    @Req() req: ReqWithRequester,
  ) {
    const data = await this.linkService.updateLink(id, dto, req.requester.sub);
    return { data };
  }

  @Delete(':id')
  @UseGuards(RemoteAuthGuard)
  async deleteLink(@Param('id') id: string, @Req() req: ReqWithRequester) {
    await this.linkService.deleteLink(id, req.requester.sub);
    return { data: true };
  }

  @Post(':id/click')
  async recordClick(@Param('id') id: string) {
    await this.linkService.recordClick(id);
    return { data: true };
  }
}
