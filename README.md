## Socket IO 로 구현하는 채팅방 예제 프로젝트

- Nest.js 프레임워크 내부에서 Socket.io 를 통해 채팅방을 구현해봅니다.

### 요구사항

- [x] 클라이언트가 채팅방에 참여할 수 있다.
- [x] 클라이언트는 실시간으로 메세지를 전송하거나 수신할 수 있다.
- [x] 클라이언트는 닉네임을 설정할 수 있다.
- [x] 방에 입장하거나 퇴장했을 때 방에 알림을 띄운다.
- [ ] 관리자는 채팅방의 인원을 내보낼 수 있다.
- [ ] 최대 참가자 수를 제한할 수 있다.
  - 최대 참가자 수에 도달하면, 더이상 채팅방에 들어올 수 없다.

## 1. 리소스 생성

- `nest g res chat` 명령어를 통해 리소스를 생성
- 리소스 타입은 WebSocket 이고 기본 CRUD 는 생성하지 않는다.

## 2. 테스트 방법

1. Socket.io 클라이언트를 구현
2. Postman 을 이용

### Postman 테스트 화면 예시

- Socket IO 타입의 화면을 이용할 수 있다.
- 상단의 파란색 Connect 버튼으로 Socket.io 서버와 연결할 수 있다.
- 우측 하단의 "joinRoom" 이라고 적힌 부분이 이벤트의 이름을 말한다.
- 좌측에는 어떤 데이터 형태로 보낼지 JSON 이라고 적힌 부분이 있는데 그 부분을 수정하여 여러 데이터를 보낼 수 있다.
- 두번째 사진처럼 Message 탭에서 Events 탭으로 이동하면 수신하고 싶은 이벤트의 이름을 작성하고 Listen 할 수 있다.

![picture 0](https://imagedelivery.net/c0750V8GHadkePE_Tgk4TA/3a439af5-b028-48c2-6c1d-8f6bed2ff000/public)

![picture 1](https://imagedelivery.net/c0750V8GHadkePE_Tgk4TA/f48f7d36-dd14-455b-44c3-d75883ad9100/public)
