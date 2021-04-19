const db = require('../db/db');
require('dotenv').config();

exports.newGroup = (req,res)=>{
    const {group_id, GName, Email} = req.body
    
    db.query('SELECT user_id FROM users WHERE email = ?',[Email],(err,results)=>{
        if(err){
            console.log("Could Not find the user!")
        }
    db.query('INSERT INTO groups SET ?',
        { group_name:GName , user_id: results[0].user_id},(error, result) => {
            if(error) throw error
            console.log(result)
        })

    })
    res.render('profile',{
        GName:GName
    })
}