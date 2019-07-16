var express = require('express');
var path = require('path');
var jwt = require('jsonwebtoken');
var config = require('../config.json')
var router = express.Router();

var Users = require('../models/users');


router.get('/', function (req, res) {
    res.render('login', { layout: 'unauthorized' });
});

router.post('/', (req, res, next) => {
    Users.authenticate(req, res, function (error, user) {
        if (error || !user) {
            res.render('error', { message: error, layout: 'unauthorized' });
        } else {
            res.locals.loggedUser = user.FullName;
            try {
                var token = jwt.sign({ LoggedUser: user.FullName }, config.SecretKey);
                res.cookie('user_id', token);
            } catch (err) {
                console.log(err);
            }
            res.redirect('/index');
        }
    });
});

router.post("/signup", (req, res, next) => {
    console.log(req.body);
    if (req.body.Password == req.body.RePassword) {
        Users.create(req.body).then(result => {
            res.redirect('/');
        }).catch(err => {
            next(err);
        });
    }
    else {
        res.render('error', { message: "Passwords don't match", layout: 'unauthorized' });
    }
});

router.get("/signup", (req, res) => {
    res.render('signup', { layout: 'unauthorized' });
});

router.get('/logout', (req, res) => {
    res.clearCookie('user_id');
    res.redirect('/');
});



module.exports = router;