import mongoose from "mongoose";
import e from "express";

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
})
const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
}

export default connectDB;