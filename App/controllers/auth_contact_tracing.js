const db = require('../db/db')

exports.contact_tracer = (req, res)=>{
    let {date, contacted_email} = req.body;
    // console.log(date);
    // console.log(contacted_email);

    db.query('SELECT user_id FROM users WHERE email = ?',[contacted_email],(err,result)=>{
        if(err) throw err;
        let u_id = result[0].user_id;
        db.query('SELECT * FROM contact WHERE user_id = ? AND contacted_user = ?', [req.user.user_id, u_id],(err, results)=>{
            if(err) throw err;
            if(results.length === 0){
                console.log("Result not found. ADDING")
                db.query('INSERT INTO contact SET user_id = ?, contacted_user = ?, date_contacted = ?', [req.user.user_id, u_id, date],(err, finalResult) =>{
                        console.log(req.user.user_id +" contacted with "+ result[0].user_id +" on " + date);
                })
            }else {
                console.log("Result Found. Updating")
                db.query('UPDATE contact SET date_contacted = ? WHERE user_id = ? AND contacted_user = ?', [date, req.user.user_id, u_id],(err, finalResult) =>{
                    console.log(req.user.user_id +" contacted with "+ result[0].user_id +" on " + date);
                })
            }
        })
    })
    
    res.redirect([req.params.id])
}