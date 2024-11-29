import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || '';

        if (!process.env.MONGO_URI) {
            console.warn("MONGO_URI not set.");
        }
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB:`, error); 

        process.exit(1);
    }
};

export default connectDB;
