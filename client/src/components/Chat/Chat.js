import React, { useState, useEffect} from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import './Chat.css'

import Input from '../Input/Input'
import InfoBar from '../InfoBar/InfoBar'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'
let socket;

export default function Chat( {location} ) {
    const [ name, setName ] = useState('')
    const [room, setRoom ] = useState('')
    const [ messages, setMessages] = useState([])
    const [ message, setMessage] = useState('')
    const [ roomData, setRoomData ] = useState([])
    const Endpoint = 'localhost:5000'

    useEffect(() => {
       const {name, room} = queryString.parse(location.search) 
       
       socket = io(Endpoint)
       setName(name)
       setRoom(room)
       socket.emit('join',{name, room},(error)=>{
           if(error)
                alert(error)
       });
    //    console.log(socket)

      // component unmount
    //    return ()=>{
    //        socket.emit('disconnect')

    //        socket.off()
    //    }
    },[ Endpoint,location.search ]);

    useEffect (() => {        
        socket.on('message',(message) => {
            setMessages(messages => [...messages,message])
        })

        socket.on('roomData',(roomData)=>{
            setRoomData(roomData.users);
        })
    },[]);

    // function for sending messages
    const sendMessage = (event) =>{
        event.preventDefault()

        if(message){
            socket.emit('sendMessage',message,() => setMessage(''))
        }
    }
    console.log(messages)
    return (
        <div className = "outerContainer">
            <div className = "container">
                <InfoBar room = {room} />
                <Messages messages = {messages} name = {name} />
                <Input message = {message} setMessage = {setMessage} sendMessage = {sendMessage} />
            </div>
            <TextContainer users = {roomData} />
        </div>
    )
}
