const express = require('express');
const db = require('../db/db');  
const authController = require('../controllers/auth_profile')
const router = express.Router();

router.get('/',authController.isLoggedIn, (req, res) =>{   
    res.render('index',{
        user:req.user
    }); 
})
router.get('/register', (req, res) =>{
    res.render('register');
})
router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/profile',authController.isLoggedIn,(req,res)=>{
   if(req.user){
       res.render('profile',{
           name:req.user.first_name +" "+ req.user.last_name,
           email:req.user.email
       })
   }else{
    res.redirect('/login');
   }
})
router.get('/newgroup',(req,res)=>{
    res.render('GR');
})

module.exports = router;