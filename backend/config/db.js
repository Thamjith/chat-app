import mongoose from 'mongoose';

const connection_url = 'mongodb://143.110.179.176:27017/chatApp?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(connection_url, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB;