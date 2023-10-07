import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Public()
  @Post()
  login(@Body() createLoginDto: CreateLoginDto) {
    return this.loginService.login(createLoginDto);
  }

  @Get('test')
  getTest(@Request() req) {
    return req.user;
  }
}
