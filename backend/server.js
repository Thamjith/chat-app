import express from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db.js'
import messageContent from './model/messagesModel.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 9000


connectDB();

app.use(express.json())

app.get('/', (req, res)=>res.status(200).send('hello world'));

app.post('/api/messages/new', (req, res) => {
    const dbMessage = req.body
    messageContent.create(dbMessage, (err, data) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
})

app.listen(port, ()=>console.log(`Listening on localhost:${port}`))