const smtp = require('nodemailer-smtp-transport');
const emailSender = require('nodemailer');
const db = require('../db/db');
const client = require('./sms')

exports.addMember = (req,res)=>{
    let {member_email, unique_id} = req.body;
    var memberid = 0;
    
    db.query('SELECT * FROM users WHERE email = ?',[member_email], (err, result)=>{
        
        if(err) throw err;
        if(result.length === 0){
            return res.render('Addmember',{message: "The user is not registered. Please enter the email of registered user"})
        }else {
            memberid = result[0].user_id;
            let phone = result[0].phone;
            console.log(memberid)
            db.query('SELECT * FROM groups WHERE group_id = ?', [unique_id], (err, result)=>{
                if(err) throw err;
                if(result.length === 0){
                    return res.render('Invalid unique id. Please try again with a valid unique id')
                }else{
                    let groupName = result[0].group_name;
                    console.log(groupName)
                    db.query('INSERT INTO groups SET group_id = ?, group_name = ?, user_id = ?', [unique_id, groupName, memberid],(err, result)=>{
                        if(err) throw err;
                        else{
                            sendText(phone, groupName);
                            sendEmail(member_email,groupName);
                            return res.render('Addmember', {
                                messageSuccess: `The user has been registered to group ${groupName}`
                            })
                        }
                    })
                }
            })
        }
    })
    
    
}




exports.showMember = (req,res)=>{
    

    let mysql =`SELECT 
                    u.first_name, 
                    u.last_name,
                    u.email 
                FROM  USERS u 
                    JOIN (SELECT user_id FROM GROUPS WHERE group_id= ? AND user_id NOT LIKE ?) as p ON (u.user_id = p.user_id) `

    db.query(mysql, [req.params.id, req.user.user_id], (err, result)=>{
        if(err) throw err
        else{
            
            res.render('GroupInfo', {
                result,
                id: req.user.user_id,
                group_id: req.params.id
            })
           
        }
    })
    
}



const sendEmail = (email, groupName) =>{
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
    html : `<p>You have been added to a group ${groupName}. Update your application if you test positive or contact someone in the group</p>` 
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
const sendText = (phone, groupName)=>{

    client.messages.create({
        body: `You have been added to a group ${groupName} . Update your application if you test positive or contact someone in the group`,
        to: '+1'+phone,  // Text this number
        from: '+12016902174' // From a valid Twilio number
    });
    console.log('Text Sent Successfully')
}