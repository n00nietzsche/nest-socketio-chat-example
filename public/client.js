const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

socket.on('connect', () => {
  socket.emit('joinRoom', { room: 'room1' });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit('message', {
      room: 'room1',
      message: input.value,
      sender: 'client',
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
