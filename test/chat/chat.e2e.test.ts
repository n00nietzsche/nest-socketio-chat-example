import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../../src/app.module';

describe('ChatGateway (e2e)', () => {
  let app: INestApplication;
  let socket: Socket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3000);

    // 클라이언트 소켓 연결
    socket = io('http://localhost:3000');
  });

  afterAll(async () => {
    socket.disconnect();
    await app.close();
  });

  it('message 이벤트에 내용을 전달하면, payload 를 클라이언트에게 브로드캐스팅한다.', (done) => {
    socket.emit('message', 'Hello Server');

    socket.on('message', (data) => {
      console.log('data', data);
      expect(data).toBe('Hello Server');
      done();
    });
  });
});
