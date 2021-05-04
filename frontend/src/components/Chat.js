import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import "./Chat.css";
import axios from '../axios.js';

import { Avatar, IconButton } from '@material-ui/core';
import { SearchOutlined, AttachFile, MoreVert } from '@material-ui/icons';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';

const Chat = ({ messages }) => {

    const [input, setInput] = useState("");
    const [seed, setSeed] = useState('');
    const [chatName, setChatName] = useState('');
    const { chatID } = useParams();

    useEffect(() => {
        if(chatID){
            axios.get(`api/chats/sync/${chatID}`).then((response) => {
                setChatName(response.data.name);
                console.log("chat = ", response)
                console.log("url = ", `api/chats/sync/${chatID}`)
            });
        }
    }, [chatID])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [chatID])

    const sendMessage = async (e) => {
        e.preventDefault();
        await axios.post('api/messages/new', {
            "message": input,
            "name": "Demo App",
            "timestamp" : "Just now!",
            "received": true
        });
        setInput("");
    }

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>

                <div className="chat__headerInfo">
                    <h3>{chatName}</h3>
                    <p>Last seen at ...</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">

                {messages.map((message) => (
                    <p className={`chat__message ${message.received && "chat__receiver"}`}>
                        <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">
                            {message.timestamp}
                        </span>
                    </p>
                ))}

            </div>

            <div className="chat__footer">
                <InsertEmoticonIcon />

                <form>
                    <input
                        value={input} 
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message" 
                        type="text" 
                    />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>

                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
