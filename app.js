const express = require("express")
const path = require("path")
const {createServer} = require("http")

const app = express()
const server = createServer(app)

const { Server } = require("socket.io")
const io = new Server(server)

const port = 8888

const messages = []


app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + "/chat.html")
})

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("loadMessages", () => {
        const data = JSON.stringify(messages)
        socket.emit("oldMessages", data)
    })

    socket.on("sendMessage", data => {
        // console.log(data);
        messages.push(data)
        socket.emit("message", data)
    })
})

server.listen(port, () => console.log(`http://localhost:${port}`))




