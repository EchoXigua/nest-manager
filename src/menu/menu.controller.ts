import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Response,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('menu')
@ApiTags('菜单管理')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('list')
  @ApiOperation({ summary: '获取菜单', description: '获取所有的菜单权限' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.menuService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取菜单详情' })
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Post('create')
  @ApiOperation({ summary: '创建菜单' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新菜单' })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }

  @Get('list/tree')
  getTree() {
    return this.menuService.getTree();
  }
}
