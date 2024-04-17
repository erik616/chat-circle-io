let websocket

const login = document.querySelector(".login")
const loginForm = login.querySelector(".login-form")
const loginInput = login.querySelector(".login-input")

const chat = document.querySelector(".chat")
const chatInput = chat.querySelector(".chat-input")
const messages = chat.querySelector(".messages")

const colors = [
    "aqua",
    "aquamarine",
    "blueviolet",
    "brown",
    "cadetblue",
    "crimson",
    "darkcyan",
    "salmon",
    "seagreen",
]

const randonColor = () => {
    const randonInd = Math.floor(Math.random() * (colors.length - 1) + 1)
    return colors[randonInd]
}

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
    if (!onUser) return

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = io("http://localhost:8888")
    websocket.emit("loadMessages")
    // console.log(websocket);
}
app()

loginForm.addEventListener("submit", handleSubmit)
chat.addEventListener("submit", handleMessage)


function handleSubmit(event) {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = randonColor()


    console.log(user);
    localStorage.setItem("@circle_app", JSON.stringify(user))
    window.location.reload()
}

websocket.on("oldMessages", (data) => {
    const oldMessages = JSON.parse(data)
    for (const message of oldMessages) {
        processMessage(message);
    }
})

websocket.on("message", function(data) {
    processMessage(data)
})

function processMessage( data ) {
    const { message, userColor, userId, userName } = JSON.parse(data)

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
        message: chatInput.value
    }

    chatInput.value = ""
    
    const message = JSON.stringify(dataMessage)

    websocket.emit("sendMessage", message)
}



//localStorage.removeItem("@circle_app")