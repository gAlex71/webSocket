import React, { useState, useRef } from "react";

const WebSock = () => {
    const socket = useRef()
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')
    const [connected, setConnected] = useState(false)
    const [username, setUsername] = useState('')

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            console.log('Подключение установлено')
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }

    const sendMessage = async() => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    if(!connected){
        return(
            <div className="center">
                <div className="form">
                    <input 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        type="text" 
                        placeholder="Введите ваше имя"
                    />
                    <button onClick={connect}>Войти</button>
                </div>
            </div>
        )
    }

    return(
        <div className="center">
            <div>
                <div className="form">
                    <input 
                        value={value} 
                        onChange={e => setValue(e.target.value)} type="text" placeholder="Введите сообщение"
                    />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                
                <div className="messages">
                    {messages.map(mess => 
                        <div key={mess.id}>
                            {mess.event === 'connection'
                                ?   <div className="connection_message">
                                        Пользователь {mess.username} подключился
                                    </div>
                                :   <div className="message">
                                        {mess.username}. {mess.message}
                                    </div>
                            }
                        </div>   
                    )}
                </div>
            </div>
        </div>
    )
}

export default WebSock