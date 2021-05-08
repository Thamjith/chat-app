import React, { useState } from 'react';

import './Login.css';

import { Button } from '@material-ui/core';
import { useStateValue } from '../StateProvider';
import { actionTypes } from '../reducer';
import axios from '../axios.js';

const Login = () => {
    const [{}, dispatch] = useStateValue();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [username, setUsername] = useState(null);
    // const [token, setToken] = useState(null);

    const signIn = () => {
        axios.post(
            `api/users/login`,
            {
                "email" : email,
                "password": password
            }
        ).then((response) => {
            console.log("credentials = ", response)
            // setUsername(response.data.name)
            // setToken(response.data.token)
            localStorage.setItem('userInfo', JSON.stringify(response.data))
            dispatch({
                type: actionTypes.SET_USER,
                user: response.data.name,
                id: response.data._id
            });
        });
    }

    return (
        <div className="login">
            <div className="login__container">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/800px-WhatsApp.svg.png"
                    alt="whatsapp Logo"
                />
                <div className="login__text">
                    <h1>Sign in to WhatsApp</h1>
                </div>
                <div className="login__inputBox">
                    <input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email" 
                        placeholder="example@email.com" 
                    />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                    />
                </div>
                <Button onClick={signIn}>
                    Sign In
                </Button>
            </div>
        </div>
    )
}

export default Login
