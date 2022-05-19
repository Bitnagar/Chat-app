//**********OPEN AND CLOSE OVERLAY************ 
const activeUsersIcon = document.getElementById('people');
const activeUsersOverlay = document.querySelector('.active-users-overlay-container');
const mainChatArea = document.querySelector('.chat-main');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');


const openModal = function () {
    activeUsersOverlay.classList.remove('hidden');
  };
  
const closeModal = function () {
    activeUsersOverlay.classList.add('hidden'); 
};

activeUsersIcon.addEventListener('click', openModal);

mainChatArea.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {

    if (e.key === 'Escape' && !activeUsersOverlay.classList.contains('hidden')) {
      closeModal();
    };

});


const socket = io();

const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
  
socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room),
  outputUsers(users)
});

//Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

const userText = msg.value;

// socket.emit('Typing', (message) => {
//   socket.emit('text', userText);
//   userIsTyping(message);
// });

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
    
    //GET MESSAGE TEXT
    const msg = e.target.elements.msg.value;
  
    //emit message to server
    socket.emit('chatMessage', msg);
  
    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

// function userIsTyping(message) {
//   const div = document.createElement('div');
//   div.classList.add('message-user-is-typing hidden');
//   div.innerHTML = `<p class="meta">${message.username}</p>
//   <p class="text">
//      is typing...
//   </p>`;
//   document.querySelector('.chat-messages').appendChild(div);
// }

//output messsage to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
  <p class="text">
     ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

//add room name to DOM
function outputRoomName(room) {

  roomName.innerText = room;
  
}

// add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}
