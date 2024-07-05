// 방 입장 전
document.addEventListener('DOMContentLoaded', () => {
  const $enterButton = document.getElementById('button_enter');

  $enterButton.addEventListener('click', () => {
    const room = document.getElementById('room').value;
    const nickname = document.getElementById('nickname').value;

    if (room && nickname) {
      activateChat(nickname, room);
    }
  });
});

// 방 입장하면 UI 변경하는 함수
function displayChatUi() {
  const $enterUserInfoArea = document.getElementById('area_enterUserInfo');
  const $enterMessageArea = document.getElementById('area_enterMessage');

  $enterUserInfoArea.style.display = 'none';
  $enterMessageArea.style.display = 'block';
}

// Socket.IO 연결 시작 및 채팅에 필요한 이벤트 바인딩
function activateChat(nickname, room) {
  console.log('room', room);
  console.log('nickname', nickname);

  displayChatUi();

  const socket = io('ws://localhost:3000', {
    query: {
      room,
      nickname,
    },
  });
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  socket.on('connect', () => {
    socket.emit('joinRoom', { room });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (input.value) {
      socket.emit('message', {
        room,
        message: input.value,
      });

      input.value = '';
    }
  });

  socket.on('message', (response) => {
    const { room, message, sender } = response;

    const item = document.createElement('li');
    item.textContent = `${room}/${sender}: ${message}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on('notify', (response) => {
    console.log('response', response);
    const { room, message, sender } = response;

    const item = document.createElement('li');
    item.textContent = `${room}/${sender}: ${message}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });

  const $kickButton = document.getElementById('button_kick');

  $kickButton.addEventListener('click', () => {
    const nickname = prompt('강퇴할 유저의 닉네임을 입력해주세요.');

    socket.emit('kickUser', {
      nickname,
    });
  });
}
