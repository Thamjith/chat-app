import express from 'express';
import connectDB from './config/db.js'

const app = express();
const port = process.env.PORT || 9000

connectDB();

app.get('/', (req, res)=>res.status(200).send('hello world'));

app.listen(port, ()=>console.log(`Listening on localhost:${port}`))