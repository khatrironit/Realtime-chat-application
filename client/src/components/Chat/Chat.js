import React, { useState, useEffect} from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
import './Chat.css'

let socket;

export default function Chat( {location} ) {
    const [ name, setName ] = useState('')
    const [room, setRoom ] = useState('')
    const [ messages, setMessages] = useState([])
    const [ message, setMessage] = useState('')
    const Endpoint = 'localhost:5000'

    useEffect(() => {
       const {name, room} = queryString.parse(location.search) 
       
       socket = io(Endpoint)
       setName(name)
       setRoom(room)
       socket.emit('join',{name, room},(error)=>{
           if(error)
                console.log(error)
       });
    //    console.log(socket)

       //component unmount
    //    return ()=>{
    //        socket.emit('disconnect')

    //        socket.off()
    //    }
    },[ Endpoint,location.search ]);

    useEffect (() => {        
        socket.on('message',(message) => {
            console.log("useEfffect called")
            console.log(message)
            setMessages(messages => [...messages,message])
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
            <div className = "innerContainer">
                <input value = {message} onChange = {event => setMessage(event.target.value)} onKeyPress = {event => (event.key === 'Enter') ? sendMessage(event) : null} />
            </div>
        </div>
    )
}
