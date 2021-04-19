const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const client = require('./sms');
const db = require('../db/db');

require('dotenv').config();

exports.login = async (req,res)=>{
    try{
        const {email, password} =req.body;
        // console.log(req.body.password);
        if(!email || !password){
            return res.status(400).render('login',{
                message:"Please provide email and password"
            });
        }
        db.query('SELECT * FROM users WHERE email = ?',[email], async (err,results)=>{
            // console.log(results); 
            // !(await bcrypt.compare(password, results[0].password))
            if(!results || password != results[0].password){
                res.status(401).render('login',{
                    message: 'Email or password is incorrect'
                })
            }
            else{
                const id = results[0].user_id;

                const token = jwt.sign({id}, process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("The token is: " + token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);                
                res.status(200).render('index',{
                    name: results[0].first_name,
                    email: email
                })
            }
        })
    }catch(error){
        console.log(error);
    }

}
