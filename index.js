import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./DB/db.js";
import router from "./ROUTES/routes.js"
import cookieParser from "cookie-parser";




let app = express();
dotenv.config()



app.use(cors({
    // origin:"http://localhost:5173",
    origin:"vishal-imdb.netlify.app",
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/uploads",express.static("uploads"))
app.use(cookieParser())
app.use("/api",router)

app.listen(process.env.PORT,()=>{
    connectDB(process.env.MONGO_URL),
    console.log("SERVER RUNNING....");
    
})