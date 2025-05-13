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
  Query,
} from '@nestjs/common';
import {
  RemoteAuthGuard,
  RemoteAuthGuardOptional,
} from 'src/share/guards/auth.guard';
import { ILinkService } from './link.port';
import {
  ClickLinkDTO,
  CreateLinkDTO,
  LinkCondDTO,
  BulkDeleteLinkDTO,
} from './link.model';
import { Inject } from '@nestjs/common';
import { PagingDTO, ReqWithRequester, ReqWithRequesterOpt } from 'src/share';
import { LINK_SERVICE } from 'src/modules/link/link.di-tokens';
import { paginatedResponse } from 'src/share/utils';

@Controller('links')
export class LinkHttpController {
  constructor(
    @Inject(LINK_SERVICE)
    private readonly linkService: ILinkService,
  ) {}

  @Post()
  @UseGuards(RemoteAuthGuardOptional)
  async createLink(
    @Body() dto: CreateLinkDTO,
    @Req() req: ReqWithRequesterOpt,
  ) {
    const requester = req.requester;

    const data = await this.linkService.createLink(dto, requester?.sub);
    return { data };
  }

  @Get('workspace')
  @UseGuards(RemoteAuthGuard)
  async getWorkspaceLinks(
    @Query() dto: LinkCondDTO,
    @Query() paging: PagingDTO,
  ) {
    const data = await this.linkService.listInWorkspace(dto, paging);

    return {
      data: paginatedResponse(data, dto),
    };
  }

  @Get('check-key-availability')
  @UseGuards(RemoteAuthGuard)
  async checkKeyAvailability(
    @Query('key') key: string,
    @Query('workspaceId') workspaceId: string,
  ) {
    const exists = await this.linkService.checkKeyExists(key, workspaceId);
    return { data: { isAvailable: !exists, key } };
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

  @Get('check-key/:key')
  @UseGuards(RemoteAuthGuard)
  async checkKeyExists(
    @Param('key') key: string,
    @Query('workspaceId') workspaceId: string,
  ) {
    const exists = await this.linkService.checkKeyExists(key, workspaceId);
    return { data: exists };
  }

  @Post('click')
  async click(@Body() dto: ClickLinkDTO) {
    const data = await this.linkService.recordClick(dto);
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

  @Delete()
  @UseGuards(RemoteAuthGuard)
  async bulkDeleteLinks(
    @Body() dto: BulkDeleteLinkDTO,
    @Req() req: ReqWithRequester,
  ) {
    await this.linkService.bulkDeleteLinks(dto, req.requester.sub);
    return { data: true };
  }

  // @Post(':id/click')
  // async recordClick(@Param('id') id: string) {
  //   await this.linkService.recordClick(id);
  //   return { data: true };
  // }
}
