const db = require('../db/db')
const smtp = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');
const client = require('./sms');


exports.contact_tracer = (req, res)=>{
    let {date,cont_email} = req.body;
    let self_positive_status = req.user.positive;
    let self_user_id = req.user.user_id;
    let message = "WARNING!!!! You might have contacted COVID 19. Please go for covid test!"
    // console.log(date+ " "+contacted_email+ " "+self_positive_status)
    var _SQL_cont_id_positive_ = 'SELECT user_id, positive, phone FROM users WHERE email = ?' //reteives contacted user's user id and positive status
   
    db.query(_SQL_cont_id_positive_, cont_email, (err,results)=>{
        if(err) throw err;
        else{
            cont_phone = results[0].phone;
            cont_user_id = results[0].user_id;
            cont_positive_status = results[0].positive;
            console.log("The contacted user's email is "+cont_email+" user_id is "+ cont_user_id+" positive status is "+ cont_positive_status +" phone is "+ cont_phone);
            console.log("The self user's email is "+req.user.email+" user_id is "+ self_user_id+" positive status is "+ self_positive_status);

            if(self_positive_status === 'yes') sendWarningEmailAndText(cont_phone, cont_email, message);
            else if(cont_positive_status === 'yes') sendWarningEmailAndText(req.user.phone, req.user.email, message);
            
            // var _SQL_insert_in_contact_ = 'INSERT INTO contact SET date_contacted = ?, user_id = ?, contacted_user = ?';
            // db.query(_SQL_insert_in_contact_,[date, self_user_id, cont_user_id]) 
            var _SQL_existing_check = 'SELECT * FROM contact WHERE user_id = ? AND contacted_user = ? OR user_id = ? AND contacted_user = ?'
            db.query(_SQL_existing_check, [self_user_id, cont_user_id,cont_user_id,self_user_id],(err, results)=>{
                        console.log(results);
                        if(err) throw err;
                        if(results.length === 0){
                            console.log("Result not found. ADDING")
                            db.query('INSERT INTO contact SET user_id = ?, contacted_user = ?, date_contacted = ?', [self_user_id, cont_user_id, date],(err, result) =>{
                                    console.log(self_user_id +" contacted with "+ cont_user_id +" on " + date);
                            })
                        }else {
                            console.log("Result Found. Updating")
                            var _SQL_update_contact_tracing = `UPDATE contact 
                                                               SET date_contacted = ?, user_id = ?, contacted_user = ?
                                                               WHERE user_id = ? AND contacted_user = ? OR contacted_user = ? AND user_id = ?`
                            var vals = [date, self_user_id, cont_user_id, self_user_id, cont_user_id, self_user_id, cont_user_id]
                            db.query(_SQL_update_contact_tracing, vals,(err, result) =>{
                                console.log(self_user_id +" contacted with "+ cont_user_id +" on " + date);
                            })
                        }
                    })
        }
    })
    res.redirect([req.params.id])
}

let sendWarningEmailAndText = (phone, email, message)=>{
    client.messages.create({
        body: `${message}`,
        to: '+1'+phone,  // Text this number
        from: '+12016902174' // From a valid Twilio number
    });
    console.log('Message Sent!')
 //----------------------------------------
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'covid19.contact.tracer2021@gmail.com',
                pass: process.env.PASSWORD
            }
        });

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
                console.log('Email Sent Successfully');
            }
        });
}