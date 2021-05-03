import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

import axios from '../axios';

import "./SidebarChat.css"
import { Avatar } from '@material-ui/core'

const SidebarChat = ({ id, name, addNewChat }) => {

    const [seed, setSeed] = useState('');

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, [])

    const createChat = async () => {
        const roomName = prompt("Please enter name for chat");

        if(roomName){
            await axios.post("api/chats/new", {
                "name": roomName
            })
        }
    };

    return !addNewChat ? (
        <Link to={`/chats/${id}`}>
            <div className='sidebarChat'>
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="sidebarChat__info">
                    <h2>{name}</h2>
                    <p>{id}</p>
                </div>
            </div>
        </Link>
    ) : (
        <div onClick={createChat} className="sidebarChat">
            <h2>Add new Chat</h2>
        </div>
    )
}

export default SidebarChat
