const clientSocket = io();

// Elements selector
const chat = document.querySelector('#chat-content')
const form = document.querySelector('#chat-input > form')

// Client join room
clientSocket.emit('join')

// Confirm message sent and output to DOM
clientSocket.on('receiveMessage', (data, id) => {
    console.log(data)
    outputMessage(data, id)

    chat.scrollTop = chat.scrollHeight
})

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    let data = e.target.elements.message.value;

    data = data.trim();
    console.log(data)

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
function outputMessage(data, id) {
    let time = new Date()
    const container = document.createElement('div')
    const sender = document.createElement('p')
    const message = document.createElement('p')

    time = (time.getHours() < 10 ? "0" : "")  + time.getHours() + ":" + (time.getMinutes() < 10 ? "0" : "") + time.getMinutes()
    
    container.classList.add(id === clientSocket.id ? 'message-to' : 'message-from')
    message.classList.add('message-content')

    sender.innerText = `${id} | ${time}`
    message.innerText = data

    container.appendChild(sender)
    container.appendChild(message)
    chat.appendChild(container)
}