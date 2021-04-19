const express = require('express');
const db = require('../db/db');  
const authController = require('../controllers/auth_profile')
const authControllerMemberAddition = require('../controllers/auth_addShow_member')
const router = express.Router();

router.get('/',authController.isLoggedIn, (req, res) =>{   
    if(req.user){
        let id = req.user.user_id;
        console.log(id);
        res.render('index',{
        user:req.user,
        id
    }); 
    }else{
        res.render('index');
    }
    
})
//Renders register page
router.get('/register', (req, res) =>{res.render('register');})
//Renders login page
router.get('/login',(req,res)=>{res.render('login');})

router.get('/profile/:id',authController.isLoggedIn,(req,res)=>{
    let id = req.user.user_id;
    if(req.user){
        db.query('SELECT * FROM groups WHERE user_id = ?', [req.params.id],(err, result)=>{
            if(err) throw err;
            else{
                res.render('profile',{
                    name:req.user.first_name +" "+ req.user.last_name,
                    email:req.user.email,
                    id,
                    result
                })
            }
        })

       
   }else{
    res.redirect('/login');
   }
})
router.post('/addmember', authControllerMemberAddition.addMember);
router.get('/addmember',authController.isLoggedIn, (req,res)=>{
    if(req.user){
        res.render('Addmember',{
            id:req.user.user_id
        });
    }else{
        res.render('Addmember')
    }
    
})


router.get('/group/:id',authController.isLoggedIn, authControllerMemberAddition.showMember);
router.get('/newgroup',(req,res)=>{
    res.render('GR');
})

module.exports = router;