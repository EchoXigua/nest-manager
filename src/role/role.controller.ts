import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('role')
@ApiTags('角色管理')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  @ApiOperation({ summary: '创建角色' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get('list')
  @ApiOperation({ summary: '角色分页查询' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.roleService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取角色详情' })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新角色信息' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
