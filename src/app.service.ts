import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  getHello(): string {
    return 'Hello World!';
  }

  testRmq(data: any) {
    this.logger.log('rmq.....', data);
  }
}
