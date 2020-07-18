const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

const Port = process.env.Port || 5000

const router = require('./router')
const { use } = require('./router')
const app = express()
const server = http.createServer(app);
const io = socketio(server)

app.use(router)

io.on('connection',(socket) => {
    console.log('we have a socket connection!!')

    socket.on('join',({name,room}, callback)=>{
        const { error, user } = addUser({id:socket.id,name,room})

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message',{user : 'admin', text : `${user.name}, welcome to the room ${user.room}`})
        socket.broadcast.to(user.room).emit('message',{user : 'admin', text: `${user.name} has joined the room`})

        callback();
    })

    socket.on('sendMessage',( message, callback)=>{
        const user = getUser(socket.id)

        io.to(user.room).emit('message',{user : user.name, text : message})
        callback()
    })
    socket.on('disconnect',()=>{
        console.log('user has left!!')
    })
})
server.listen(Port , ()=>console.log(`server is running on ${Port}`))