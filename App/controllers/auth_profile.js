const jwt = require('jsonwebtoken');
const db = require('../db/db');
const { promisify } = require('util');
require('dotenv').config();

exports.isLoggedIn = async (req, res, next)=>{
    // console.log(req.cookies);
    if(req.cookies.jwt){
        try{
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, 
            process.env.JWT_SECRET);
            // console.log(decoded);
                
            db.query('SELECT * FROM users WHERE user_id = ?',[decoded.id],(error, result)=>{
                // console.log(result);
                if(!result) {
                    next();
                }
                req.user = result[0];
                return next();
            });
        }
        catch(error){
            throw error;
            next();
        }
    }else{
        next();
    }
}

exports.logOut = async (req, res, next) =>{
    res.cookie('jwt','logout',{
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    });
    res.status(200).redirect('/login')
}