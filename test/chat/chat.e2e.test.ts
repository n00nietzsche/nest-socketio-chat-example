import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../../src/app.module';

describe('ChatGateway (e2e)', () => {
  let app: INestApplication;
  let socket: Socket;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3000);

    // 클라이언트 소켓 연결
    socket = io('http://localhost:3000');
  });

  afterEach(async () => {
    socket.disconnect();
    await app.close();
  });

  it('room1 에 참여하면, room1 에 해당하는 메세지만 전달받는다.', (done) => {
    // given: room1 에 참여하면
    socket.emit('joinRoom', {
      room: 'room1',
    });

    // when: room1 과 room2 에 메세지가 전송됐을 때
    socket.emit('message', {
      room: 'room1',
      message: 'test message1',
    });

    socket.emit('message', {
      room: 'room2',
      message: 'test message2',
    });

    // then: room1 로 전송된 메세지를 정상적으로 받을 수 있다.
    socket.on(
      'message',
      (data: { room: string; message: string; sender: string }) => {
        expect(data.room).toBe('room1');
        expect(data.message).toBe('test message1');
        expect(data.sender).toBeDefined();
        done();
      },
    );
  });

  it('room2 에 참여하면, room2 에 해당하는 메세지만 전달받는다.', (done) => {
    // given: room2 에 참여하면
    socket.emit('joinRoom', {
      room: 'room2',
    });

    // when: room2 에 메세지가 전송됐을 때
    socket.emit('message', {
      room: 'room2',
      message: 'test message2',
    });

    // then: room2 로 전송된 메세지를 정상적으로 받을 수 있다.
    socket.on(
      'message',
      (data: { room: string; message: string; sender: string }) => {
        expect(data.room).toBe('room2');
        expect(data.message).toBe('test message2');
        expect(data.sender).toBeDefined();
        done();
      },
    );
  });

  it('room 을 떠나면, 메세지를 전달받지 않는다.', (done) => {
    // given: room2 에 참여한 뒤 room 을 떠나면,
    socket.emit('joinRoom', {
      room: 'room2',
    });

    socket.emit('leaveRoom', {
      room: 'room2',
    });

    // when: room2 에 메세지가 전송됐을 때
    socket.emit('message', {
      room: 'room2',
      message: 'test message2',
    });

    // then: room2 로 전송된 메세지를 정상적으로 받을 수 있다.
    socket.on('message', () => {
      done(new Error('방을 나갔기 때문에 메세지를 받아서는 안됩니다.'));
    });

    setTimeout(() => {
      done();
    }, 500);
  });
});
