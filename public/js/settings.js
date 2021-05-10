document.querySelector('#btn-back').addEventListener('click', () => window.location.href = '/')

const changeUsernameButton = document.querySelector('#btn-change-username')
changeUsernameButton.addEventListener('click', async e => {
    const newValue = prompt('Insert new username').trim()
    const response = await fetch('/setting/username', {
      method: 'POST',
      body: JSON.stringify({username: newValue }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    
    if (data.err) alert(data.err)
    else if (!data.username) alert("Please provide a value")
    else location.reload()
})

try {
  const changeRoomnameButton = document.querySelector('#btn-change-roomname')
  changeRoomnameButton.addEventListener('click', async e => {
    const newValue = prompt('Insert new room name').trim()
    const response = await fetch('/setting/roomname', {
      method: 'POST',
      body: JSON.stringify({roomname: newValue }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()

    if (data.err) alert(data.err)
    else if (!data.roomname) alert("Please provide a value")
    else location.reload()
  })
} catch(err) {
  console.log(err)
}

const logoutButton = document.querySelector('#btn-logout')
logoutButton.addEventListener('click', () => { 
  if (confirm("Are you sure you want to logout?")) window.location.href='/logout'
})

const exportChatButton = document.querySelector('#btn-export-chat')
exportChatButton.addEventListener('click', () => window.location.href='/export/chat')
const exportUserButton = document.querySelector('#btn-export-user')
exportUserButton.addEventListener('click', () => window.location.href='/export/user')
