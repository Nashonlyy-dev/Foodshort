const FoodPartnerModel = require("../models/foodpartner.model");
const UserModel = require("../models/user.model")
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");

async function authFoodPartner(req, res, next){

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "Please Login first"
        })
    }

     try {

         const decoded =  jwt.verify(token, process.env.JWT_SECRET);         

         const foodPartner = await FoodPartnerModel.findById(decoded.id);

         req.foodPartner = foodPartner;

         next();

    }catch (error) {

        return res.status(401).json({
            message: "Invalid Token, Please login again"
        })

    }
    }


async function authUser(req, res,next) {

     const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "Please Login first"
        })
    }

     try {

         const decoded =  jwt.verify(token, process.env.JWT_SECRET);         

         const user = await UserModel.findById(decoded.id);

         req.user = user;

         next();

    }catch (error) {

        return res.status(401).json({
            message: "Invalid Token, Please login again"
        })

    }
    
}

    module.exports = {
        authFoodPartner,
        authUser
    }   