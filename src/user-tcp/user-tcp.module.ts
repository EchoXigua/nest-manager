import { Module } from '@nestjs/common';
import { UserTcpService } from './user-tcp.service';
import { UserTcpController } from './user-tcp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ClientsModule.registerAsync([
      {
        name: 'XG_SOCKET',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('SOCKET_HOST'),
            // port: 3060,
            port: +configService.get<string>('SOCKET_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UserTcpController],
  providers: [UserTcpService],
})
export class UserTcpModule {}
