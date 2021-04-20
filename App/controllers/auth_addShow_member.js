const express = require('express');
const { NetworkContext } = require('twilio/lib/rest/supersim/v1/network');
const db = require('../db/db');
const sendEmail = require('./emailsender')

exports.addMember = (req,res)=>{
    let {member_email, unique_id} = req.body;
    var memberid = 0;
    
    db.query('SELECT * FROM users WHERE email = ?',[member_email], (err, result)=>{
        
        if(err) throw err;
        if(result.length === 0){
            return res.render('Addmember',{message: "The user is not registered. Please enter the email of registered user"})
        }else {
            memberid = result[0].user_id;
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
                            sendEmail(member_email);
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