const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const client = require('./sms');
const db = require('../db/db');
require('dotenv').config();
const smtp = require('nodemailer-smtp-transport');
const emailSender = require('nodemailer');



exports.register = (req, res)=>{
    const {fname, lname, age, email, password, phone, passwordConfirm} = req.body;
    console.log(req.body);
    db.query('SELECT email FROM users WHERE email = ?', [email], (error, result) =>{
        if(error){
            console.log("this is error")
            console.log(error);
        }
        if(result.length > 0){
            return res.render('register',{
                message: 'That email is already in use'
            })
        } else if(password !== passwordConfirm){
            return res.render('register',{
                message: 'Passwords do not match'
            });
        }

    // let hashedPassword = await bcrypt.hash(password, 8);
    // console.log(hashedPassword);
    console.log(req.body);
    db.query('INSERT INTO users SET ?', {
        first_name: fname, last_name: lname, age: age, email: email, phone: phone, password: password}, (error, result) =>{
            if(error){
                console.log(error);
            } 
                sendEmailandText(email,phone);
                console.log("Success!")
                res.render('register', {
                    message: 'User registered successfully'
                    
                });
            
        })
        
    }
    );

    sendEmailandText = (email, phone)=>{
        client.messages.create({
            body: `Welcome to Covid Contact Tracer. You will recieve a warning text from this number if we suspect you have been contracted with COVID-19.`,
            to: phone,  // Text this number
            from: '+12016902174' // From a valid Twilio number
        });
     //----------------------------------------
            let transporter = emailSender.createTransport(smtp({
                service: 'gmail',
                auth: {
                    user: 'covid19.contact.tracer2021@gmail.com',
                    pass: process.env.PASSWORD
                }
            }));
    
            let mailDetails = {
                from : 'Covid Contact Tracer', 
                to   : email,
                subject: 'Covid Contact Tracer',
                html : '<p>Thank you for signing up with Covid Contact Tracing app. Time to self monitor you and your family!</p>' 
            };
            console.log(email);
    
            transporter.sendMail(mailDetails, (err, info) => {
                if(err){
                    console.log('Error sending email');
                    throw err;
                } else{
                    console.log('Email Sent Successfully');
                }
            });
    }
}


