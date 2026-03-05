import userModel from "../MODELS/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* 
   REGISTER ============
*/
let userRegister = async (req, res) => {
  try {
    const { fullname, email, city, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const image = req.file ? req.file.filename : null;

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      fullname,
      email,
      city,
      password: hashPassword,
      image,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Registration failed",
    });
  }
};


/* 
   LOGIN ===========
 */
let userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user._id ,
        role: user.role
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    return res.status(200).json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Login failed",
    });
  }
};


/* 
   GET PROFILE ========================= */
let getProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("-password")
      .populate("watchlist");

      console.log(req.user)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({ user });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};


/* 
   LOGOUT ========================= */
const userLogout = (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      message: "Logout successful"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Logout failed"
    });
  }
};


/* 
   WATCHLIST SYSTEM ========================= */

// Add to Watchlist
import mongoose from "mongoose";

let addToWatchlist = async (req, res) => {
  try {
    console.log("User ID:", req.user?.id);
    console.log("Movie ID:", req.params.movieId);

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const movieId = req.params.movieId;

    const alreadyExists = user.watchlist.some(
      (id) => id.toString() === movieId
    );

    if (!alreadyExists) {
      user.watchlist.push(new mongoose.Types.ObjectId(movieId));
      await user.save();
    }

    return res.status(200).json({
      message: "Added to watchlist",
      watchlist: user.watchlist
    });

  } catch (error) {
    console.log("WATCHLIST ERROR:", error);
    return res.status(500).json({
      message: "Failed to add to watchlist"
    });
  }
};

// Remove from Watchlist
let removeFromWatchlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    user.watchlist = user.watchlist.filter(
      movie => movie.toString() !== req.params.movieId
    );

    await user.save();

    return res.status(200).json({
      message: "Removed from watchlist"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove from watchlist"
    });
  }
};

//  Get Watchlist
let getWatchlist = async (req, res) => {
  try {
    const user = await userModel
  .findById(req.user.id)
  .select("-password")
  .populate("watchlist");
    return res.status(200).json({
      watchlist: user.watchlist
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch watchlist"
    });
  }
};

export {
  userRegister,
  userLogin,
  getProfile,
  userLogout,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist
};