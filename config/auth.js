function ensureAuthentication(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash('error_message', "Please log in to view your page");
    res.redirect('users/login');
}

function forwardAuthentication(req,res,next) {
    if (!req.isAuthenticated()) {
        return next();
    }

    res.redirect('/my-page');
}


module.exports = {
    ensureAuthentication: ensureAuthentication,
    forwardAuthentication: forwardAuthentication
};
