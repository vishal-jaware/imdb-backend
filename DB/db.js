import mongoose from "mongoose";

let connectDB = async (url) => {
    await mongoose.connect(url)
    console.log("DATABASE CONNECTED....");
    
}

export default connectDB