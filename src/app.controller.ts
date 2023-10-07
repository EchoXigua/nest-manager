import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';
import { UserService } from './user/user.service';
import { LoginData } from './event/user.event';
import { LoginService } from './login/login.service';
import { FindUser } from './user/event';
import { CreateUserDto } from './user/dto/create-user.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly loginService: LoginService,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @EventPattern('manager_user')
  @MessagePattern({ cmd: 'manager_user' })
  getUser(@Payload() data: FindUser) {
    return this.userService.findAll({
      pageSize: data.pageSize || 10,
      current: data.current || 1,
    });
  }

  @MessagePattern({ cmd: 'findUser' })
  async findUserById(id: string) {
    return await this.userService.findOne(id);
  }

  @MessagePattern({ cmd: 'getAllUser' })
  async findAll() {
    return await this.userService.findAll({ pageSize: 1000, current: 1 });
  }

  @MessagePattern({ cmd: 'asyn_user' })
  async asynUserInfo(@Payload() data: any) {
    return await this.userService.findAll(data);
  }

  @MessagePattern({ cmd: 'manager_login' })
  async login(@Payload() data: LoginData) {
    // return await this.loginService.login(data);
    return await this.loginService.loginMicro(data);
  }

  @MessagePattern({ cmd: 'manager_register' })
  async register(@Payload() data: CreateUserDto) {
    return await this.userService.create(data);
  }

  @EventPattern('test_rmq')
  async testRmq(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('rmq data', data);
    this.appService.testRmq(data);
  }
}
