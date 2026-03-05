import jwt from "jsonwebtoken"
import userModel from "../MODELS/usermodel.js"

let adminMiddleware = async (req,res,next)=>{
    
    try{

        let token = req.cookies.token

        if(!token){
            return res.status(401).json({message:"Login first"})
        }

        let decoded = jwt.verify(token,process.env.SECRET_KEY)

        let user = await userModel.findById(decoded.id)

        if(user.role !== "admin"){
            return res.status(403).json({message:"Admin access only"})
        }

        next()

    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Unauthorized"})
    }

}

export default adminMiddleware