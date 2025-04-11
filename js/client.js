const socket = io('https://real-time-chat-app-backend-ipn6.onrender.com');
// const socket = io('http://localhost:8000');

// get elements from the DOM
const form = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageContainer = document.querySelector(".container");

// audio that will play on receiving messages

var audio = new Audio('message-getting-sound.mp3');

// function to append message to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer .append(messageElement);
    if (position === 'left') {
        audio.play();
    }
    // Scroll to the bottom of the message container
    if (position === 'left') {
        messageElement.classList.add('left');
    } else {
        messageElement.classList.add('right');
    }
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// function to send message on form submit
// when user submits the form, send the message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send-chat-message', message);
    messageInput.value = '';
}
);

// Ask new user for their name and let the server know
// when user joins the chat, ask for their name and send it to the server

const username = prompt("Enter your name to join");
socket.emit('new-user-joined', username);

// when a new user joins the chat, let everyone know
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'left');
}
);
// when a new message is received, append it to the container
socket.on('chat-message', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// when a user disconnects, let everyone know
// when a user leaves the chat, let everyone know
socket.on('user-disconnected', name => {
    append(`${name} left the chat`, 'left');
}
);