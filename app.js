const express = require("express")
const path = require("path")
const { createServer } = require("http")

const app = express()
const server = createServer(app)

const { Server } = require("socket.io")
const io = new Server(server)

const port = 8888

const messages = []

const users = []


app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + "/chat.html")
})

io.on("connection", (socket) => {
    // console.log(socket.id);

    socket.on("select_room", (data) => {
        const {room} = data
        console.log("room",room);
        socket.join(room)

        const userInRoom = users.find(user => user.data_user.name === data.onUser.name && user.room === room)

        if (userInRoom) {
            userInRoom.socket_id = socket.id
        } else {
            users.push({
                room: room,
                data_user: data.onUser,
                socket_id: socket.id
            })
        }

        // console.log(users);

    })


    socket.on("sendMessage", data => {
        messages.push(data)
        const {room} = data
        console.log("mensage",data);
        io.to(room).emit("message", data)
        // socket.emit("message", data)
    })


    socket.on("loadMessages", (data) => {

        const data_messages = messages
        socket.emit("oldMessages", data_messages)
    })

})

server.listen(port, () => console.log(`http://localhost:${port}`))




