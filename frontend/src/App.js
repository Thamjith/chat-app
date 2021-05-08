import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Pusher from 'pusher-js';

import './App.css';
import axios from './axios';

import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Login from './components/Login';
import ChatDefault from './components/ChatDefault';

import { useStateValue } from './StateProvider';

function App() {
  const [{ user, id }, dispatch] = useStateValue();
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios.get("api/messages/sync").then((response) => {
      setMessages(response.data);
    });
    axios.get(`api/chats/sync/${id}`).then((response) => {
      console.log("api = ", `api/chats/sync/${id}`)
      console.log("apiResponse = ", response)
      setChats(response.data);
    });
  }, [user]);

  useEffect(() => {

    var pusher = new Pusher(`${process.env.REACT_APP_PUSHER_ID}`, {
      cluster: 'ap2'
    });

    var channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage])
    });

    var channel2 = pusher.subscribe('chats');
    channel2.bind('inserted', function(newChat) {
      setChats([...chats, newChat])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      channel2.unbind_all();
      channel2.unsubscribe();
    };

  }, [messages, chats])

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
            <Sidebar chats={chats} />
            <Switch>
              <Route path="/chats/:chatID">
                <Chat messages={messages} />
              </Route>
              <Route path="/">
                {/* <h1>Home Screen</h1> */}
                <ChatDefault />
              </Route>
            </Switch>
          </Router>
        </div>
        )}
      </div>
  );
}

export default App;
