import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/menu/entities/menu.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,

    private readonly dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  async login(createLoginDto: CreateLoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        account: createLoginDto.account,
      },
      relations: ['role'],
    });
    console.log('login');
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    /**
     * 用户存在的情况下，
     * 1. 密码重试次数？
     * 2. 对比密码是否正确
     * 3. 重试时间
     */
    if (
      user.loginRetryTime !== '0' &&
      user.loginRetryTime < '' + new Date().getTime()
    ) {
      user.loginRetry = 0;
      user.loginRetryTime = '0';
    }
    if (user.loginRetry >= 3) {
      user.loginRetryTime = '' + new Date().getTime() + 1000 * 60 * 10;
      await this.userRepository.save(user);
      throw new Error('账号被锁,请稍后重试');
    }
    if (createLoginDto.password === user.password) {
      const roles = user.role.map((item) => item.id);

      const menus = user.role && (await this.getMenu(user.role));

      //用户信息太多，这里挑点常用的节省带宽
      const userInfo = {
        id: user.id,
        account: user.account,
        email: user.email,
        phone: user.phone,
      };
      return {
        id: user.id,
        access_token: await this.jwtService.signAsync(userInfo),
        account: user.account,
        email: user.email,
        phone: user.phone,
        username: user.username,
        avatar: user.avatar,
        loginInfo: {
          menus: menus,
          perms: [],
          roles,
        },
      };
    } else {
      user.loginRetry++;
      await this.userRepository.save(user);
      throw new Error('密码错误');
    }
  }

  private async getMenu(roleList: Role[]) {
    let map = new Map();
    await Promise.all(
      roleList.map(async (item) => {
        const role = await this.roleRepository.findOne({
          where: { id: item.id },
          relations: ['menu'],
        });
        role.menu &&
          role.menu.forEach((item) => {
            map.set(item.id, item);
          });
        //获取实体下面的所有子体，以tree的形式
        // const res = await this.dataSource.manager
        //   .getTreeRepository(Menu)
        //   .findDescendantsTree(role.menu[0]);
        // console.log('res', res);
      }),
    );
    const menus = Array.from(map.values());
    map = null;
    const menuList = await Promise.all(
      menus.map(async (item) => {
        return await this.menuRepository.findOne({
          where: { id: item.id },
          relations: ['pid'],
        });
      }),
    );
    return this.arrToTree(menuList);
  }

  private arrToTree(menus: Menu[]) {
    const list = [];
    menus.forEach((menu) => {
      if (menu.pid == null) {
        list.push(menu);
        return;
      } else {
        list.forEach((item) => {
          item.id === (menu.pid as Menu).id
            ? item.children
              ? item.children.push(menu)
              : (item.children = [menu])
            : null;
        });
      }
    });
    return list;
  }

  async loginMicro(createLoginDto: CreateLoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        account: createLoginDto.account,
      },
      relations: ['role'],
    });
    if (!user) {
      return {
        code: 500,
        message: '用户不存在'
      }
       
    }
    /**
     * 用户存在的情况下，
     * 1. 密码重试次数？
     * 2. 对比密码是否正确
     * 3. 重试时间
     */
    if (
      user.loginRetryTime !== '0' &&
      user.loginRetryTime < '' + new Date().getTime()
    ) {
      user.loginRetry = 0;
      user.loginRetryTime = '0';
    }
    if (user.loginRetry >= 3) {
      user.loginRetryTime = '' + new Date().getTime() + 1000 * 60 * 10;
      await this.userRepository.save(user);
      // return new Error('账号被锁,请稍后重试');
      return {
        code: 500,
        message: '账号被锁,请稍后重试'
      }
    }
    if (createLoginDto.password === user.password) {
      const roles = user.role.map((item) => item.id);

      const menus = user.role && (await this.getMenu(user.role));

      //用户信息太多，这里挑点常用的节省带宽
      const userInfo = {
        id: user.id,
        account: user.account,
        email: user.email,
        phone: user.phone,
      };
      return {
        id: user.id,
        access_token: await this.jwtService.signAsync(userInfo),
        account: user.account,
        email: user.email,
        phone: user.phone,
        username: user.username,
        avatar: user.avatar,
        loginInfo: {
          menus: menus,
          perms: [],
          roles,
        },
      };
    } else {
      user.loginRetry++;
      await this.userRepository.save(user);
      // return new Error('密码错误');
      return {
        code: 500,
        message: '密码错误'
      }
    }
  }
}
