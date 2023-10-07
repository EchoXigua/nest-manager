import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/menu/entities/menu.entity';
import { User } from 'src/user/entities/user.entity';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Role, User])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
