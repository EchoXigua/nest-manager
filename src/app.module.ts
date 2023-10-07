import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from './upload/upload.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginModule } from './login/login.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { UserTcpModule } from './user-tcp/user-tcp.module';

let envFilePath = ['.env'];
export const IS_DEV = process.env.RUNNING_ENV !== 'prod';

envFilePath.unshift(`.env.${process.env.RUNNING_ENV}`);

// if (IS_DEV) {
//   envFilePath.unshift('.env.dev');
// } else {
//   envFilePath.unshift('.env.prod');
// }

@Module({
  imports: [
    UserModule,
    RoleModule,
    MenuModule,
    ConfigModule.forRoot({
      isGlobal: true,
      //提供env的路径
      envFilePath,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'mysql', //数据库类型
        username: process.env.DATABASE_USER, //账号
        password: process.env.DATABASE_PASSWORD, //密码
        host: process.env.DATABASE_HOST, //host
        port: +process.env.DATABASE_PORT, //
        // database: 'test2', //库名
        database: config.get('DATABASE_NAME'),
        synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库
        retryDelay: 500, //重试连接数据库间隔
        retryAttempts: 10, //重试连接数据库的次数
        autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组
      }),
      inject: [ConfigService],
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql', //数据库类型
    //   username: process.env.DATABASE_USER, //账号
    //   password: process.env.DATABASE_PASSWORD, //密码
    //   host: process.env.DATABASE_HOST, //host
    //   port: +process.env.DATABASE_PORT, //
    //   // database: 'test2', //库名
    //   synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库
    //   retryDelay: 500, //重试连接数据库间隔
    //   retryAttempts: 10, //重试连接数据库的次数
    //   autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
    // }),
    UploadModule,
    LoginModule,
    AuthModule,
    UserTcpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
