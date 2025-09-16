const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req,res,next) => {
    try{
        const authHeader = req.headers.authorization;

        if(authHeader && authHeader.startsWith("Bearer ")){
            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({message:"Not Authorized, invalid token format"});
            }
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.id).select("-password");
            if (!req.user) {
                return res.status(401).json({message:"Not Authorized, user not found"});
            }
            next();
        } else {
            res.status(401).json({message:"Not Authorized, no token provided"});
        }
    }
    catch(error){
        console.error("Auth middleware error:", error.message);
        res.status(401).json({message:"Token failed",error:error.message});
    }
};

module.exports= {protect};