const db = require('../db/db');
const client = require('./sms');

exports.tested_positive = (req, res,next)=>{
    console.log(req.body);
    console.log(req.user.user_id);
    let yesPositive = 'yes';
    db.query('UPDATE users SET positive = ? , date_tested_positive = ? WHERE user_id = ?',[yesPositive, req.body.date, req.user.user_id],(err, results)=>{
        if(err) throw err;
        console.log(results);
        client.messages.create({
            body: `You confirmed that you have been tested positive with covid 19. Please quarantine yourself for 14 days.`,
            to: req.user.phone,  // Text this number
            from: '+12016902174' // From a valid Twilio number
        });
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