const UserModel = require('../models/user.model');
const FoodPartnerModel = require('../models/foodpartner.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res){
    const {fullName, email, password} = req.body;

    const isUserPresent = await UserModel.findOne({email: email});

    if(isUserPresent){
        return res.status(400).json({
            message: "User already present"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await UserModel.create({
        fullName,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET);

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        userDetails: {
            fullName: user.fullName,
            email: user.email
        }
    })
}

async function loginUser(req, res){
    const {email, password} = req.body;

    const user = await UserModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET);

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        userDetails: {
            fullName: user.fullName,
            email: user.email
        }
    })
}

    function logoutUser(req,res){
        res.clearCookie("token")
        res.status(200).json({
            message: "User successfully logout"
        })
     }

async function registerPartner(req, res)   {
    const { name, email, password,contactName,phone,address } = req.body;

    // Validate required fields
    if (!name || !email || !password ||  !contactName || !phone || !address) {
        return res.status(400).json({
            message: "Name, email,password,  contactName, phone, addressare required."
        });
    }

    const isPartnerPresent = await FoodPartnerModel.findOne({ email });
    if (isPartnerPresent) {
        return res.status(400).json({
            message: "FoodPartner already present"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const foodpartner = await FoodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        contactName,
        phone,
        address
    });

    const token = jwt.sign({
        id: foodpartner._id
    }, process.env.JWT_SECRET);

    res.cookie("token", token);

    res.status(201).json({
        message: "FoodPartner registered successfully",
        foodpartnerDetails: {
            name: foodpartner.name,
            email: foodpartner.email,
            contactName: foodpartner.contactName,
            phone: foodpartner.phone,
            address: foodpartner.address
        
        }
    });

}

async function loginPartner(req, res){
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required."
        });
    }

    const partner = await FoodPartnerModel.findOne({ email });
    if (!partner) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, partner.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign({
        id: partner._id
    }, process.env.JWT_SECRET);

    res.cookie("token", token);

    res.status(200).json({
        message: "Partner logged in successfully",
        partnerDetails: {
            name: partner.name,
            email: partner.email
        }
    });
}

 function logoutPartner(req,res){
        res.clearCookie("token")
        res.status(200).json({
            message: "Partner successfully logout"
        })
     }



module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerPartner,
    loginPartner,
    logoutPartner
}