import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

import './App.css';
import axios from './axios';

import Sidebar from './components/Sidebar';
import Chat from './components/Chat';

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("api/messages/sync").then((response) => {
      setMessages(response.data);
    });
  }, []);

  useEffect(() => {
    var pusher = new Pusher('c5f9f9647b331394475d', {
      cluster: 'ap2'
    });

    var channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };

  }, [messages])

  console.log(messages);

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat messages={messages} />
      </div>
    </div>
  );
}

export default App;
