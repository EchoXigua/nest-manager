import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserTcpDto } from './dto/create-user-tcp.dto';
import { UpdateUserTcpDto } from './dto/update-user-tcp.dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserTcpService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('XG_SOCKET')
    private socketClient: ClientProxy,
  ) {}

  create(createUserTcpDto: CreateUserTcpDto) {
    return 'This action adds a new userTcp';
  }

  save(userInfo: UpdateUserTcpDto) {
    this.socketClient.emit('saveUserInfo', userInfo);
    return this.userRepository.update(userInfo.id, userInfo);
  }

  findAll() {
    return `This action returns all userTcp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userTcp`;
  }

  update(id: number, updateUserTcpDto: UpdateUserTcpDto) {
    return `This action updates a #${id} userTcp`;
  }

  remove(id: number) {
    return `This action removes a #${id} userTcp`;
  }
}
