import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("Incoming cookies:", req.cookies);

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. No token."
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded; 

    next(); // move to next controller

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

export default authMiddleware;