const db = require('../db/db');
const client = require('./sms');
const nodemailer = require('nodemailer');
const smtp = require('nodemailer-smtp-transport');

exports.tested_positive = (req, res)=>{
    console.log(req.body);
    console.log(req.user.user_id);
    let mark_positive = 'yes';

    let _SQL_check_Contacted = 'SELECT user_id, contacted_id FROM contact WHERE user_id = ? OR contacted_id = ?'
    db.query(_SQL_check_Contacted,[req.user.user_id, req.user.user_id], (err, results)=>{
        if(err) throw err;
        console.log(results)
    })

    db.query('UPDATE users SET positive = ? , date_tested_positive = ? WHERE user_id = ?',[mark_positive, req.body.date, req.user.user_id],(err, results)=>{
        if(err) throw err;
        else{
            let message = 'You confirmed that you have been tested positive with covid 19. Please quarantine yourself for 14 days.'
            console.log(results);
            sendTextandEmail(req.user.phone, req.user.email, message);
        }
    })
    
    db.query('SELECT * FROM groups WHERE user_id = ?', [req.params.id],(err, result)=>{
        if(err) throw err;
        else{
            res.render('profile',{
                name:req.user.first_name +" "+ req.user.last_name,
                email:req.user.email,
                id: req.user.user_id,
                result,
                tested_positive: "WARNING: You confirmed that you have been tested positive. Quarantine yourself for 14 days."
            })
        }
    })
}

exports.tested_negative = (req,res)=>{
    let user_id = req.user.user_id;
    let mark_negative = 'no';
    console.log("I AM HERE!")
    db.query('UPDATE users SET positive = ? , date_tested_positive = ? WHERE user_id = ?',['no','NULL', user_id],(err, results)=>{
        if(err) throw err;
        else{
        
        let message = 'What a great news! Congratulations for the recovery. Together we can make everyone safe.'
        sendTextandEmail(req.user.phone,req.user.email,message)
        }
        
    })
    db.query('SELECT * FROM groups WHERE user_id = ?', [req.params.id],(err, result)=>{
        if(err) throw err;
        else{
            res.render('recovered',{
                name:req.user.first_name +" "+ req.user.last_name,
                email:req.user.email,
                id: req.user.user_id,
                result
            })
        }
    })
}

const sendTextandEmail = (phone, email, message)=>{
    client.messages.create({
        body: message,
        to: phone,  // Text this number
        from: '+12016902174' // From a valid Twilio number
    });
    console.log("Message Sent");
    let transporter = nodemailer.createTransport(smtp({
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
        html : `<p>${message}</p>` 
    };
    console.log(email);
    
    transporter.sendMail(mailDetails, (err, info) => {
        if(err){
            console.log('Error sending email');
            throw err;
        } else{
            console.log('Email Sent Successfully!');
        }
    });
}