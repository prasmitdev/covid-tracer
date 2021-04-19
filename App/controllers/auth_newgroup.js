const db = require('../db/db');
require('dotenv').config();

exports.newGroup = (req,res)=>{
    const {group_id, GName, Email} = req.body
    
    db.query('SELECT user_id FROM users WHERE email = ?',[Email],(err,results)=>{
        console.log(results)
        if(err){
            console.log("Could Not find the user!")
        }
    
        else{
        db.query('INSERT INTO groups SET group_id = ?, group_name = ?, user_id = ?',[group_id, GName, results[0].user_id],(error, result) => {
            if(error) throw error
            else{
                db.query('SELECT group_name FROM groups WHERE user_id = ?',[results[0].user_id], (err,Finalresult)=>{
                    if(err) throw err
                    console.log(Finalresult)
                    res.render('GR',{message: "Group created"})
                })
                
            }
        })
       
        }
    } 
    )
    
}