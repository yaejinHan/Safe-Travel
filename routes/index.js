/*
this index page is routes that user accesses with path including / from homepage
routes that it supports
    /          - homepage
    /my-page   - user's page after login
*/

const express = require('express');
const router = express.Router();
const schHelper = require('../models/schHelper');
const schInstance = new schHelper();



const { ensureAuthentication, forwardAuthentication } = require('../config/auth');

router.get('/', forwardAuthentication, (req,res) => {
    res.render('home');
});

// cannot view my-page unless user authenticated
router.get('/my-page', ensureAuthentication, (req,res) => {
    res.render('my-page', {
        user: req.user
    })
});



router.post('/my-page', async (req,res)=> {
    const trainName = req.body.train;
    const link = schInstance.getLink(trainName);

    await req.user.myTrainSch.push({trainName: trainName, link: link});
    await req.user.save();


    const context = {
        data: req.user.myTrainSch,
    }

    res.render('saved-timetable', context);
}); 


///----------------> I don't get why my-page doesn't go to users/my-page when I have this route in users.js as well
router.get('/saved-subway-table', (req,res)=> {
    const context = {
        data: req.user.myTrainSch,
    }

    res.render('saved-timetable', context);
});












module.exports = router;
