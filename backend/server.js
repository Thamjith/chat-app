// LIBRARIES
import express from 'express';
import Pusher from 'pusher';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan'

// LOCAL IMPORTS
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import messagecontents from './model/messagesModel.js';
import chats from './model/chatsModel.js';

// ROUTES
import userRoutes from './routes/userRoutes.js'

dotenv.config();

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

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
        console.log("A change Happend in Messages : ", change)
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

db.once('open', () => {
    const msgCollection = db.collection("chats");
    const changeStream = msgCollection.watch();
    changeStream.on("change", (change) => {
        console.log("A change Happend in Chat : ", change)
        if(change.operationType === 'insert'){
            const chatDetails = change.fullDocument;
            pusher.trigger('chats', 'inserted',{
                _id: chatDetails._id,
                name: chatDetails.name
            });
        }else{
            console.log('Error triggering Pusher');
        }
    })
})

app.get('/', (req, res)=>res.status(200).send('hello world'));

app.get('/api/messages/sync', (req, res) => {
    messagecontents.find((err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

app.post('/api/messages/new', (req, res) => {
    const dbMessage = req.body
    messagecontents.create(dbMessage, (err, data) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
})

app.get('/api/chats/sync', (req, res) => {
    chats.find((err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

// app.get('/api/chats/sync/:id', (req, res) => {
//     chats.findById(req.params.id, (err, data) => {
//         if(err){
//             res.status(500).send(err)
//         }else{
//             res.status(200).send(data)
//         }
//     })
// })

app.get('/api/chats/sync/:id', (req, res) => {
    chats.find({user: req.params.id}, (err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

app.post('/api/chats/new', (req, res) => {
    const dbMessage = req.body
    chats.create(dbMessage, (err, data) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
})

app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port, ()=>console.log(`Listening on localhost:${port}`))