const clientSocket = io({
  reconnection: false
})
let username

// Elements selector
const chat = document.querySelector('#chat-content')
const form = document.querySelector('#chat-input > form')
const feedback = document.querySelector('#chat-feedback')
const message = document.querySelector('#message')
const settingsButton = document.querySelector('#btn-settings')
const mediaButton = document.querySelector('#chat-input > form > .btn-media-wrapper > #media')

// Client join room
clientSocket.on('join', (prevData, user) => {
  username = user.username
  prevData.forEach((c) => outputMessage(c, true))
})

// Confirm message sent and output to DOM
clientSocket.on('receiveMessage', data => {
  outputMessage(data, false) // Format message
  feedback.innerHTML = ''
  chat.scrollTop = chat.scrollHeight
})

message.addEventListener('keydown', (e) => {
  if (e.key === "Backspace" || e.key === "Delete") 
  clientSocket.emit('typing', username, true)
  else 
  clientSocket.emit('typing', username, false)
})

clientSocket.on('typing', (username, isCanceling) => {
  if (isCanceling) feedback.innerHTML = ''
  else feedback.innerHTML = `${username} is typing..`
})

settingsButton.addEventListener('click', () => window.location.href='/settings')

mediaButton.addEventListener('change', async e => {
  const formData = new FormData()
  if (mediaButton.files.length) {
    formData.append('media', mediaButton.files[0])
    const response = await fetch('/file/send', {
      method: 'PUT',
      body: formData
    })
    const data = await response.json()
    clientSocket.emit('newMessage', data)
  }
})

form.addEventListener('submit', (e) => {
  e.preventDefault()

  // Get message text
  let message = e.target.elements.message
  let media = e.target.elements.media

  if (media.value) {
    media.value = ''
  } else {
    let data = message.value.trim()

    if (!data) {
      return false
    }

    // Emit message to server
    clientSocket.emit('newMessage', data)

    // Clear input
    message.value = ''
    message.focus()
  }
})

// Output message to DOM
function outputMessage(data, fetch) {
  if (fetch) {
    data.username = data.sender.username
    data.socketID = data.sender.socketID
    delete data.sender
  }
  const time = new formatTime(data.createdAt)
  const container = document.createElement('div')
  const sender = document.createElement('p')
  const message = document.createElement('p')

  if (data.type === 'Media') {
    const media = document.createElement('img')
    media.setAttribute('src', `file/image/${data.content}`)
    media.setAttribute('style', 'max-width:200px; width:100%;')

    container.classList.add(data.socketID === clientSocket.id ? 'message-to' : 'message-from')
    message.classList.add('message-content')

    sender.innerText = `${data.username} | ${time.current}`

    container.appendChild(sender)
    container.appendChild(media)
    chat.appendChild(container)
  } else {
    container.classList.add(data.socketID === clientSocket.id ? 'message-to' : 'message-from')
    message.classList.add('message-content')

    sender.innerText = `${data.username} | ${time.current}`
    message.innerText =data.content

    container.appendChild(sender)
    container.appendChild(message)
    chat.appendChild(container)
  }
}

function formatTime(time) {
  this.raw = new Date(time)
  this.hours = (this.raw.getHours() < 10 ? "0" : "")  + this.raw.getHours()
  this.minutes = (this.raw.getMinutes() < 10 ? "0" : "")  + this.raw.getMinutes()
  this.current = `${this.hours}:${this.minutes}`

  return this
}
