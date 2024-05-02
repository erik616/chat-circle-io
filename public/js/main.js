let websocket
let room

const chat = document.querySelector(".chat")
const chatInput = chat.querySelector(".chat-input")
const messages = chat.querySelector(".messages")

const cardRoom = document.querySelector(".room")
const roomInput = cardRoom.querySelector(".login-input")
const btnRoom = cardRoom.querySelector(".btn-room")

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("message-self")
    div.innerHTML = content
    return div
}

const createMessageFriendElement = (content, sender, color) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    span.style.color = color
    span.innerHTML = sender
    span.classList.add("message-sender")

    div.classList.add("message-friend")
    div.appendChild(span)

    div.innerHTML += content
    return div
}


const getUser = () => localStorage.getItem("@circle_app")
const onUser = JSON.parse(getUser())
const user = { id: "", name: "", color: "" }

function app() {
    const url = new URL(window.location.href)
    room = url.searchParams.get("select_room")

    if (!onUser) {
        window.location = "/"
        return
    }

    websocket = io("http://localhost:8888")
    
    if(!room) {
        cardRoom.style.display = "block"
        chat.style.display = "none"
        return
    }


    websocket.emit("loadMessages", room)
}
app()


btnRoom.addEventListener("click", getRoom)
chat.addEventListener("submit", handleMessage)


websocket.on("oldMessages", (data) => {
    const oldMessages = data
    for (const message of oldMessages) {
        processMessage(message);
    }
})

websocket.on("message", (data) => {
    console.log(data);
    processMessage(data)
})

function processMessage(data) {
    const { message, userColor, userId, userName } = data

    const element = userId == onUser.id ? createMessageSelfElement(message) : createMessageFriendElement(message, userName, userColor)

    messages.appendChild(element)
    scrollScreen()
}


function handleMessage(event) {
    event.preventDefault()

    const dataMessage = {
        userId: onUser.id,
        userName: onUser.name,
        userColor: onUser.color,
        message: chatInput.value,
        room
    }

    chatInput.value = ""

    // const message = JSON.stringify(dataMessage)

    websocket.emit("sendMessage", dataMessage)
}

function getRoom(event) {
    event.preventDefault()

    if(!roomInput.value) return

    const urlSearch = new URLSearchParams(window.location.search)
    urlSearch.set("select_room", `${roomInput.value}`)
    room = urlSearch.get("select_room")

    
    websocket.emit("select_room", {
        onUser,
        room
    })
    
    window.location = window.location.origin + window.location.pathname + `?select_room=` + room
}
