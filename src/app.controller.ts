import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  main(): string {
    return `<a href="/index.html">웹소켓 테스트 클라이언트로 이동하기</a>`;
  }
}
