import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors';
import { ErrorHandle } from './common/errorHandle';
import { ResCommon } from './common/resCommon';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

import * as express from 'express'
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const server = express()
  const adapter = new ExpressAdapter(server)

  const app = await NestFactory.create(AppModule,adapter);
 
  // 创建微服务
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3301
    }
  })
  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://43.139.245.195:5672'],
  //     queue: 'message',
  //     noAck: false,
  //     persistent: true,
  //   },
  // });
  await app.startAllMicroservices()

  app.use(cors());
  const options = new DocumentBuilder()
    .setTitle('西瓜的接口文档')
    .setDescription('后台管理接口文档详细')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);

  //全局错误处理
  app.useGlobalFilters(new ErrorHandle());
  //全局拦截器处理
  app.useGlobalInterceptors(new ResCommon());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //过滤掉多余的参数
      // forbidNonWhitelisted: true, //不允许传多余的参数
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(3536);
}
bootstrap();
