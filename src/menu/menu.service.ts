import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { FlavorEntity } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from '../event/entities/event.entity';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    @InjectRepository(FlavorEntity)
    private readonly flavorRepository: Repository<FlavorEntity>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    console.log(this.configService.get('DATABASE_PORT'));
    //不太懂。process可以拿到值，还需要这个configModule干啥？
    console.log('process', process.env.DATABASE_PORT);
  }
  async findAll(paginationQuery: PaginationQueryDto) {
    // const data = await this.menuRepository.find({
    //   where: {
    //     title: Like(`%${query.keyword}%`),
    //   },
    //   order: {
    //     createTime: 'DESC',
    //   },
    //   skip: (query.page - 1) * query.pageSize, //从第几个开始查找
    //   take: query.pageSize, //查找多少个
    // });
    // const total = await this.menuRepository.count({
    //   where: {
    //     title: Like(`%${query.keyword}%`),
    //   },
    // });
    // return {
    //   data,
    //   total,
    // };
    const { pageSize = 1000, current = 1 } = paginationQuery;
    const menuList = await this.menuRepository.find({
      relations: ['role'],
      skip: pageSize * (current - 1),
      take: pageSize,
    });
    const total = await this.menuRepository.count();
    return {
      list: menuList,
      total,
      current,
      pageSize,
    };
  }

  async findOne(id: string) {
    // const menu = await this.menuRepository.findOneBy({ id });
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!menu) {
      throw new NotFoundException('该菜单不存在');
    }
    return menu;
  }

  async create(createMenuDto: CreateMenuDto) {
    const menu = this.menuRepository.create({
      ...createMenuDto,
      pid: await this.getParent(createMenuDto.pid),
    });

    return this.menuRepository.save(menu);
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    //preload 方法会根据传入的对象创建一个新的实体，
    //首先查看数据库中 是否存在实体，则换替换所有值，会创建一个新的不存在返回undefined
    // const menu = await this.menuRepository.preload({
    //   id,
    //   ...updateMenuDto
    // });
    // if (!menu) {
    //   throw new NotFoundException();
    // }
    // const flavor =
    //   updateMenuDto.flavor &&
    //   (await Promise.all(
    //     updateMenuDto.flavor.map((name) => this.preloadFlavorsByName(name)),
    //   ));
    // const menu = await this.menuRepository.update(id, {
    //   ...updateMenuDto,
    // });
    // return menu;
  }

  async remove(id: string) {
    const menu = await this.menuRepository.findOneBy({ id });
    return this.menuRepository.remove(menu);
  }

  async getTree() {
    // return this.dataSource.getTreeRepository(Menu).findTrees();
    return await this.dataSource.getTreeRepository(Menu).findTrees();
  }

  private async getParent(id?: string) {
    let parent: Menu | '0';
    if (!id) {
      if (id === '0') return '0';
      parent = await this.menuRepository.findOne({ where: { id } });
      if (!parent) throw new NotFoundException('上级菜单不存在');
    }
    return parent;
  }

  private async preloadFlavorsByName(name: string): Promise<any> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name },
    });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }

  private async roleById(id: string) {
    const existingRole = await this.roleRepository.findOne({
      where: { id },
    });
    return existingRole || [];
  }

  //推荐
  async recommendMenu(menu: Menu) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      menu.recommerdations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { meunId: menu.id };

      await queryRunner.manager.save(menu);
      await queryRunner.manager.save(recommendEvent);

      //提交事务
      await queryRunner.commitTransaction();
    } catch (error) {
      //如果出现失败，我们需要回滚事务，防止数据库不一致
      await queryRunner.rollbackTransaction();
    } finally {
      //最后释放掉改连接
      await queryRunner.release();
    }
  }
}
