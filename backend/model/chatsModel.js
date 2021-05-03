import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
    name: String
});

export default mongoose.model('chats', chatSchema)