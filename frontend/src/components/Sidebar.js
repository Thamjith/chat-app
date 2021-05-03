// import React, { useState, useEffect } from 'react'
import "./Sidebar.css"
import { Avatar, IconButton } from '@material-ui/core';

import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {SearchOutlined} from '@material-ui/icons';

import SidebarChat from './SidebarChat';

const Sidebar = ({ chats }) => {

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src="https://thamjiththaha.com/thamjith-thaha.jpg" />
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder="Search or start new chat" type="text" />
                </div>
            </div>

            <div className="sidebar__chats">
                <SidebarChat addNewChat />
                {/* {console.log(chats)} */}
                {chats.map(chat => (
                    <SidebarChat 
                        key={chat._id} 
                        id={chat._id}
                        name={chat.name}
                    />
                ))}
            </div>
        </div>
    )
}

export default Sidebar
