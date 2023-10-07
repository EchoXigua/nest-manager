import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';

//关联实体
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { FlavorEntity } from './entities/flavor.entity';
import { Event } from '../event/entities/event.entity';
import { Role } from 'src/role/entities/role.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  //forFeature方法与app.module.ts中将自动加载实体
  imports: [
    TypeOrmModule.forFeature([Menu, FlavorEntity, Event, Role]),
    //app.module 中加载过ConfigModule 并且调用forRoot, 其他模块直接imports，
    //注入到 service中可以获取到环境变量
    ConfigModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
