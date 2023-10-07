import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserTcpService } from './user-tcp.service';
import { CreateUserTcpDto } from './dto/create-user-tcp.dto';
import { UpdateUserTcpDto } from './dto/update-user-tcp.dto';

@Controller()
export class UserTcpController {
  constructor(private readonly userTcpService: UserTcpService) {}

  @MessagePattern('saveUserInfo')
  save(@Payload() userInfo: UpdateUserTcpDto) {
    return this.userTcpService.save(userInfo);
  }

  @MessagePattern('findAllUserTcp')
  findAll() {
    return this.userTcpService.findAll();
  }

  @MessagePattern('findOneUserTcp')
  findOne(@Payload() id: number) {
    return this.userTcpService.findOne(id);
  }
}
