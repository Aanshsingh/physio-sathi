import mongoose from "mongoose";
export async function connectDb() {
    if (!process.env.MONGODB_URI) {
        console.warn('MONGODB_URI missing ,running without db');
        
        return false
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI,{ serverSelectionTimeoutMS: 8000})
        return true
    } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    return false
    }
}


