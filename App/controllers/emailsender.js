const smtp = require('nodemailer-smtp-transport');
const emailSender = require('nodemailer');

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
module.exports = sendEmail