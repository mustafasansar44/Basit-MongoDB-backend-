const express = require('express');
const router = express.Router();
const User = require('../Model/User');
const path = require('path');
// /user/

router.get('/', (req, res) => {
    res.sendFile('login.html', { root: path.join(__dirname, '../views') });
})
router.post('/login', (req, res) => {
    console.log(User.findOne({username: req.body.username, password: req.body.password}).then(user => {
        if(user){
            req.session._id = user._id;
            res.redirect('/')
        }else{
            console.log("Böyle biri yok")
        }
    }).catch((err) => {
        console.log("Hata: "+err)
    }))
    
})


module.exports = router