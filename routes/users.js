/*
this users.js has routes that is accessible with /users path
pages that it supports
    /users/login    - user login page
    /users/register - user registration page
*/

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer')

const User = require('../models/User');
const schHelper = require('../models/schHelper');
const schInstance = new schHelper();

const { forwardAuthentication } = require('../config/auth');

const mailPoster = nodemailer.createTransport({ 
    service: "Naver",
    host: "smtp.naver.com",
    port: 587,
    auth: {
        user: 'safetravel20@naver.com',
        pass: 'Dkssud(70428',
    }
});

function mailOpt(user, subject, content) {
    const mailOption = {
        from: 'safetravel20@naver.com',
        to: user.email,
        subject: subject,
        html: content,
    };
    return mailOption;
}

function sendMail(mailOption) {
    mailPoster.sendMail(mailOption, (err, info) => {
        console.log(mailOption);
        if (err) {console.log(err);}
        else {console.log(info.response);}
    });    
}


router.get('/login', forwardAuthentication, (req,res)=> {
    res.render('login');
});


router.get('/register', forwardAuthentication, (req,res) => {
    res.render('register');
})



router.post('/register', (req,res) => {
    const {firstName, lastName, nickname, email, password, passwordCheck} = req.body;

    const errors = [];

    if (!firstName || !lastName || !nickname || !email || !password || !passwordCheck) {
        // I could change this to req.flash for all
        errors.push({ message: "Please enter all fields"});
    }

    if (password !== passwordCheck) {
        errors.push({message: "Passwords do not match"});
    }

    if (password.length < 8) {
        errors.push({ message: "Password must be at least 8 characters"});
    }

    if (errors.length > 0) {
        res.render('register', {
            errors, 
            firstName, 
            lastName, 
            nickname,
            email,
            password,
            passwordCheck
        });
    }

    else {
        // maybe change this a little bit
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({message: "Email already exists"});
                console.log('email already exists');
                res.render('register', {
                    errors, 
                    firstName,
                    lastName, 
                    nickname, 
                    email, 
                    passport, 
                    passwordCheck
                });
            }
            else {
                const secretToken = randomstring.generate(); 
                const confirmedUser = false;     

                const newUser = new User({
                    firstName,
                    lastName, 
                    nickname,
                    email,
                    password,
                    secretToken,
                    confirmedUser,
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash)=> {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user=> {
                            req.flash(
                                'success_message',
                                "You can now log in"
                            );
                        });

                        const emailContent = `Hello, Welcome to Safe Travel!<br /><br />
                        Please enter the token below to finish your registration and please don't share this token with anyone.<br />
                        Token: <b>${secretToken}</b>
                        <br><br />
                        Again, Safe Travel and have a nice day!
                        `;
                        const mailOption = mailOpt(newUser, 'Email verification from SafeTravel!', emailContent);
                        sendMail(mailOption); 
                        res.redirect('./verify');
                    });
                });
            }
        });
    }
});


router.post('/login', (req,res,next) => {

    passport.authenticate('local', (err, user, info)=> {

        console.log('user to authenticate', user);
        if (err) {return next(err);}
        // if no user was found by that credential
        if (!user) {
            req.flash('error_message', "Incorrect password or email");
            res.redirect('./login');
            return;
        }

        // if user was found but wasn't a confirmed user (no email verification yet)
        if (!user.confirmedUser) {
            // this flash message doesn't work.....
            req.flash('error_message', "Your email needs to be verified");
            res.redirect('./verify');
            return;
        }


        // if user found and email verified
        req.logIn(user, (err) => {
            if (err) {return next(err);}
            req.flash('success_message', "You are successfull logged in");
            res.redirect('/my-page');
            return;
        });
    })(req,res,next);
});


router.get('/verify', (req,res)=> {
    res.render('verifyEmail');
});

router.post('/verify', async (req,res)=> {
    const secretToken = req.body.secretToken;
    console.log(secretToken);
    const user = await User.findOne({ 'secretToken': secretToken });
    if (user) {
        user.confirmedUser = true;
        user.secretToken = "";
        await user.save();
        req.flash('success_message', "You are successfully registered");
        res.redirect('./login');
    }

    else {
        console.log('no user by that');
        req.flash('error_message', "Invalid Token");
        res.redirect('./verify');
    }
});


router.get('/reserve-a-ride', (req,res)=> {
    res.render('reserveRide');
});


router.post('/reserve-a-ride', async (req,res)=> {
    const date = req.body.date;
    const time = req.body.time;
    const location = req.body.location;
    const newRide = {
        date,
        time, 
        location,
    };

    await req.user.myRides.push(newRide);
    await req.user.save();

    const context = {
        data: req.user.myRides,
    }

    res.render('reservedRides', context);
});


router.get('/filter-ride-by-date', (req,res)=> {

    const data = schInstance.filterRides(req.user.myRides, req.query.date);
    const total = schInstance.countRides(data);
    const context = {
        data: data,
        total: total,
    };

    res.render('filterRide', context);
});



router.get('/reserved-rides', (req,res)=> {
    
    const context = {
        data: req.user.myRides,
        total: schInstance.countRides(req.user.myRides),
    };

    res.render('reservedRides', context);
});


router.get('/saved-subway-table', (req,res)=> {
    const context = {
        data: req.user.myTrainSch,
    }

    res.render('saved-timetable', context);
});


router.get('/logout', (req,res)=> {
    req.logout();
    req.flash('success_message', "You are now logged out");
    res.redirect('./login');
});














module.exports = router;