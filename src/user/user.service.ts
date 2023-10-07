import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { userSelect } from 'src/common/select';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly dataSource: DataSource,
  ) {}
  async findAll(paginationQuery: PaginationQueryDto) {
    const { pageSize = 10, current = 1 } = paginationQuery;
    let userList = []
    //这里的查询还可以优化
    if(pageSize == -1) {
      //查询所有
      userList = await this.userRepository.find({
        relations: ['role'],
        select: ['account','email','phone','role','username','id','loginIp','loginTime']
      })
    }else {
      
      userList = await this.userRepository.find({
        relations: ['role'],
        skip: pageSize * (current - 1),
        take: pageSize,
        select: ['account','email','phone','role','username','id','avatar','loginIp','loginTime']
      });
    }
    const total = await this.userRepository.count();
    return {
      list: userList,
      total,
      current,
      pageSize,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    //先查询有无该用户
    const exist = await this.userRepository.findOne({where: {
      account: createUserDto.account
    }})
    if(exist) {
      return new HttpException('用户已存在', HttpStatus.BAD_GATEWAY)
      // return '用户已存在'
    }

    const role =
      createUserDto.role &&
      (await Promise.all(createUserDto.role.map((id) => this.roleById(id))));

    const user = this.userRepository.create({
      ...createUserDto,
      role: role || [],
    });
    return this.transaction(async (queryRunner: QueryRunner) => {
      return await queryRunner.manager.save(user);
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('用户不存在');
    let flag = true;
    try {
      const role =
        updateUserDto.role &&
        (await Promise.all(updateUserDto.role.map((id) => this.roleById(id))));
      Object.assign(user, {
        ...updateUserDto,
        role: role || [],
      });
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (error) {
      flag = false;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return flag ? user : '更新失败';
  }

  async remove(id: string) {
    return this.transaction(async (queryRunner: QueryRunner) => {
      return await queryRunner.manager.delete(User, id);
    });
  }

  private async roleById(id: string): Promise<any> {
    const existRole = await this.roleRepository.findOne({ where: { id } });
    return existRole || '';
  }

  private async transaction(fns: Function) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let result = null;
    try {
      result = await fns(queryRunner);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return result;
    }
  }
}
