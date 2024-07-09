## Socket IO 로 구현하는 채팅방 예제 프로젝트

- Nest.js 프레임워크 내부에서 Socket.io 를 통해 채팅방을 구현해봅니다.

### 요구사항

- [x] 클라이언트가 채팅방에 참여할 수 있다.
- [x] 클라이언트는 실시간으로 메세지를 전송하거나 수신할 수 있다.
- [x] 클라이언트는 닉네임을 설정할 수 있다.
- [x] 방에 입장하거나 퇴장했을 때 방에 알림을 띄운다.
- [x] 관리자는 채팅방의 인원을 내보낼 수 있다.
- [x] 최대 참가자 수를 제한할 수 있다.
  - 최대 참가자 수에 도달하면, 더이상 채팅방에 들어올 수 없다.

## 실행 방법

- `pnpm install`
- `pnpm start:dev`
- [localhost:3000/index.html](http://localhost:3000/index.html) 에서 예시 HTML 클라이언트를 테스트해볼 수 있다.

## 실행 화면

### 방 입장 전 클라이언트 화면

![picture 2](https://imagedelivery.net/c0750V8GHadkePE_Tgk4TA/cdf1604e-e5bb-4f18-f083-9fea383f3e00/public)

- 방 이름과 닉네임을 입력하고 입장하기를 눌러 입장할 수 있다.

![picture 3](https://imagedelivery.net/c0750V8GHadkePE_Tgk4TA/22f578bf-7493-4969-59be-cfb7f34fe700/public)

### 방 입장 후 클라이언트 화면

- 방 입장 시 관리자는 방 이름과 현재 방의 인원에 대한 알람을 보낸다.

![picture 4](https://imagedelivery.net/c0750V8GHadkePE_Tgk4TA/b9c14a4f-8b51-4a07-2f02-d6fa0330ae00/public)

### 강퇴 기능 실행

- 사용자 강퇴가 가능하다.
- 우측 하단의 강퇴 버튼을 누르면 나오는 confirm 창으로 강퇴가 가능하다.

![picture 5](https://imagedelivery.net/c0750V8GHadkePE_Tgk4TA/0149219b-c989-4a32-1680-cd79bfbc2e00/public)

- 닉네임을 이용해 이용자를 강퇴할 수 있다. (현재 띄어쓰기가 있는 닉네임은 강퇴가 불가능하다.)
- 사용자를 강퇴시키면 강퇴당했다는 알림이 나타난다.

![picture 7](https://imagedelivery.net/c0750V8GHadkePE_Tgk4TA/5a1fb0da-a38a-41c0-1d66-93bfdf135e00/public)

## 메서드명 규칙

- Repository -> save, find, update, delete
- Service -> create, get, modify, remove
