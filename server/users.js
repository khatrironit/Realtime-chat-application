const users = [];

const addUser = ({id, name, room}) => {
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    const existingUser = users.find((user) => user.name === name && user.room === user.room)
    if(existingUser){
        return { error : 'Username Already Taken. Please Login Again With a Different Name'}
    }

    const user = {id,name,room}
    users.push(user)

    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

const getUser = (id) => users.filter((user)=>user.id === id)[0]


const getUsersInRoom = (room) => users.filter((user)=>user.room === room)


module.exports = { addUser, removeUser, getUser, getUsersInRoom }