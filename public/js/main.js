const clientSocket = io();

// Handle the browser frame that affect viewport
(function viewport_adjustment() {
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
})()
window.addEventListener('resize', () => viewport_adjustment());

// Elements selector
const chat = document.querySelector('#chat-content')
const form = document.querySelector('#chat-input > form')
const logoutButton = document.querySelector('#btn-logout')
const settingsButton = document.querySelector('#btn-settings')

// Client join room
clientSocket.emit('join')

// Confirm message sent and output to DOM
clientSocket.on('receiveMessage', (data, user) => {
    outputMessage(data, user)

    chat.scrollTop = chat.scrollHeight
})

logoutButton.addEventListener('click', () => window.location.href='/logout')
settingsButton.addEventListener('click', () => window.location.href='/settings')

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    let data = e.target.elements.message.value;

    data = data.trim();

    if (!data) {
        return false;
    }

    // Emit message to server
    clientSocket.emit('newMessage', data);

    // Clear input
    e.target.elements.message.value = '';
    e.target.elements.message.focus();
});

// Output message to DOM
function outputMessage(data, user) {
    const time = new myTime()
    const container = document.createElement('div')
    const sender = document.createElement('p')
    const message = document.createElement('p')
    
    container.classList.add(user.id === clientSocket.id ? 'message-to' : 'message-from')
    message.classList.add('message-content')

    sender.innerText = `${user.username} | ${time.current}`
    message.innerText = data

    container.appendChild(sender)
    container.appendChild(message)
    chat.appendChild(container)
}

function myTime() {
    this.raw = new Date()
    this.hours = (this.raw.getHours() < 10 ? "0" : "")  + this.raw.getHours()
    this.minutes = (this.raw.getMinutes() < 10 ? "0" : "")  + this.raw.getMinutes()
    this.current = `${this.hours}:${this.minutes}`

    return this
}
