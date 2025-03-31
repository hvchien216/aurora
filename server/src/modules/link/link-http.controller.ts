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
import { ILinkService } from './link.port';
import { ClickLinkDTO, CreateLinkDTO } from './link.model';
import { Inject } from '@nestjs/common';
import { ReqWithRequester } from 'src/share';
import { LINK_SERVICE } from 'src/modules/link/link.di-tokens';

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
    return { data };
  }

  @Post('click')
  async click(@Body() dto: ClickLinkDTO) {
    const data = await this.linkService.getLinkByKey(dto.key);
    await this.linkService.recordClick(dto, data);
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

  // @Post(':id/click')
  // async recordClick(@Param('id') id: string) {
  //   await this.linkService.recordClick(id);
  //   return { data: true };
  // }
}
