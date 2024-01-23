const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');

const requireAuth = async (req, resp, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.secret_key, async (error, decodedToken) => {
            if (error) {
                resp.status(400).json({  
                    success: false,
                    message: "Please Login first"
                });
                resp.redirect('/userLogin');
            } else if (decodedToken) {
                let user = await User.findById(decodedToken.userId);
                req.userData = user;
                next();
            }
        });
    } else {
        resp.status(400).json({
            success: false,
            message: "Please Login first"
        });
    }
};



module.exports =  requireAuth ;
