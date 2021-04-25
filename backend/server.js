import express from 'express';
import dotenv from 'dotenv';
import Pusher from 'pusher';
import cors from 'cors';

import connectDB from './config/db.js'
import messageContent from './model/messagesModel.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 9000

// Need to be replaced bu socket io [FUTURE PLAN]
const pusher = new Pusher({
    appId: "1192755",
    key: "c5f9f9647b331394475d",
    secret: "ffa02ae2ac30864e9b59",
    cluster: "ap2",
    useTLS: true
});
// END

app.use(express.json());

app.use(cors());

connectDB();

const db = mongoose.connection;

db.once('open', () => {
    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();
    changeStream.on("change", (change) => {
        console.log("A change Happend : ", change)
        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted',{
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            });
        }else{
            console.log('Error triggering Pusher');
        }
    })
})

app.get('/', (req, res)=>res.status(200).send('hello world'));

app.get('/api/messages/sync', (req, res) => {
    messageContent.find((err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

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