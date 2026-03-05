import express from "express"
import multer from "multer"
import { userLogin, userRegister, getProfile,userLogout } from "../CONTROLLERS/userController.js"
import { getMovies,getSingleMovie,getTopRated ,addMovie,deleteMovie,updateMovie} from "../CONTROLLERS/moviesController.js"
import authMiddleware from "../MIDDLEWARE/authMiddleware.js";
import adminMiddleware from "../MIDDLEWARE/adminMiddleware.js";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../CONTROLLERS/userController.js";




let router = express.Router()

let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads")
    },
    filename:function(req,file,cb){
        let name = Date.now() + " - "  + file.originalname
        cb(null,name)
    }
})

let upload = multer({storage:storage})

router.post("/userRegister", upload.single("image"), userRegister)
router.post("/login",userLogin)
router.get("/movies", getMovies);
router.get("/movies/top-rated", getTopRated);
router.get("/movies/:id", getSingleMovie);
router.get("/profile",authMiddleware, getProfile);
router.post("/userlogout",userLogout)
router.post("/watchlist/:movieId", authMiddleware, addToWatchlist);
router.get("/watchlist", authMiddleware, getWatchlist);
router.delete("/watchlist/:movieId", authMiddleware, removeFromWatchlist);
//admin route
router.post("/addmovie",authMiddleware,adminMiddleware, upload.single("image"),addMovie)

router.delete("/deletemovie/:id",authMiddleware,adminMiddleware,deleteMovie)

router.put("/updatemovie/:id",authMiddleware,adminMiddleware,upload.single("image"),updateMovie)


export default router