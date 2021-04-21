const express = require('express');
const db = require('../db/db');  
const authController = require('../controllers/auth_profile');
const authControllerMemberAddition = require('../controllers/auth_addShow_member');
const authTestedPositive = require('../controllers/auth_tested_positive');
const authContactTracer = require('../controllers/auth_contact_tracing');
const router = express.Router();

router.get('/',authController.isLoggedIn, (req, res) =>{   
    if(req.user){
        let id = req.user.user_id;
        res.render('index',{
        getuser: req.user,
        name: req.user.first_name + " " + req.user.last_name
    
    }); 
    }else{
        res.render('index');
    }
    
})

router.get('/register', (req, res) =>{res.render('register');})
router.get('/login',(req,res)=>{res.render('login');})

router.get('/profile/:id',authController.isLoggedIn,(req,res)=>{
    let id = req.user.user_id;
    if(req.user){
        db.query('SELECT * FROM groups WHERE user_id = ?', [req.params.id],(err, result)=>{
            if(err) throw err;
            else{
                db.query('SELECT positive from users WHERE user_id = ?',[req.params.id],(err,results)=>{
                    if(err) throw err;
                    if(req.user.positive === 'yes'){
                        res.render('profile',{
                            name:req.user.first_name +" "+ req.user.last_name,
                            email:req.user.email,
                            id,
                            result,
                            tested_positive: "WARNING: You have been tested positive. Quarantine yourself for 14 days from " + req.user.date_tested_positive
                        })
                    }
                    else{
                        
                        res.render('profile',{
                            name:req.user.first_name +" "+ req.user.last_name,
                            email:req.user.email,
                            id,
                            result
                        })
                    }
                })
                
            }
        })

       
   }else{
    res.redirect('/login');
   }
});

router.post('/group/:id',authController.isLoggedIn, authContactTracer.contact_tracer);
router.post('/addmember', authControllerMemberAddition.addMember);

router.post('/profile/:id',authController.isLoggedIn, authTestedPositive.tested_positive);
router.post('/recovered',authController.isLoggedIn, authTestedPositive.tested_negative);



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
router.get('/newgroup',authController.isLoggedIn, (req,res)=>{
    res.render('GR',{
        id:req.user.user_id
    });
})










module.exports = router;