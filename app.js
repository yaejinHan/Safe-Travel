require('./db'); // this is only for setting the location of the database to store and retrieve data from

const express = require('express');
const app = express();

const path = require('path');

const bodyParser = require('body-parser');

const passport = require('passport');

const flash = require('connect-flash'); // for flash messages


// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));


// to see if req method and path are correct - for my debugging purposes
app.use((req,res,next)=> {
  console.log(req.method, req.path);
  next();
});

// passport require from config
require('./config/passport')(passport);



// activate passport
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


const hbs = require('hbs');
// registering partial for flash messages
hbs.registerPartials(path.join(__dirname, '/views/partials'));


// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// for flash messages
app.use(flash());

// set global variables
app.use((req,res,next) => {
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.isAuthenticated = req.user ? true : false;
  res.locals.user = req.user;
  next();
});


// all paths in index.js prefixed by '/'
// all paths in users.js prefixed by '/users/' 
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));






// will have the default port number of 3000 or one specified by the user who opens this server
const PORT = process.env.PORT || 3000;

app.listen(PORT);


