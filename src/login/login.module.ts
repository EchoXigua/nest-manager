import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Menu])],
  controllers: [LoginController],
  providers: [LoginService, AuthService],
  exports: [LoginService]
})
export class LoginModule {}
