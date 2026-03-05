import mongoose from "mongoose";

let userShema = new mongoose.Schema({
    
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    city:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    watchlist:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"MOVIE"
    }
]
},{
    timestamps:true
})

let userModel = mongoose.model("IMDB-USER",userShema)

export default userModel