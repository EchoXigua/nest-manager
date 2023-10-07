import { PartialType } from '@nestjs/mapped-types';
import { CreateUserTcpDto } from './create-user-tcp.dto';

export class UpdateUserTcpDto extends PartialType(CreateUserTcpDto) {
  id: string;
}
