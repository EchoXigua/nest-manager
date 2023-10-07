import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/menu/entities/menu.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const menu =
      createRoleDto.menu &&
      (await Promise.all(createRoleDto.menu.map((id) => this.menuById(id))));
    const role = this.roleRepository.create({
      ...createRoleDto,
      menu: menu || [],
    });
    try {
      await queryRunner.manager.save(role);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return role;
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { pageSize = 10, current = 1 } = paginationQuery;
    const roleList = await this.roleRepository.find({
      relations: ['menu'],
      skip: pageSize * (current - 1),
      take: pageSize,
    });
    const total = await this.roleRepository.count();
    return {
      list: roleList,
      total,
      current,
      pageSize,
    };
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['menu'],
    });
    if (!role) {
      throw new NotFoundException('没有找到此角色');
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException('角色Id不存在');
    let flag = true;
    try {
      const menu =
        updateRoleDto.menu &&
        (await Promise.all(updateRoleDto.menu.map((id) => this.menuById(id))));
      Object.assign(role, {
        ...updateRoleDto,
        menu: menu || [],
      });
      await queryRunner.manager.save(role);

      await queryRunner.commitTransaction();
    } catch (error) {
      flag = false;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    if (flag) {
      return role;
    } else {
      throw new Error('更新失败');
    }
  }

  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const role = await this.roleRepository.findOne({
      where: { id },
    });
    try {
      await queryRunner.manager.delete(Role, id);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return role;
  }

  private async menuById(id: string): Promise<any> {
    const existMenu = await this.menuRepository.findOne({
      where: { id },
    });
    return existMenu || '';
  }
}
