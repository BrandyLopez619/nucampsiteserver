var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const passport = require('passport');
const authenticate = require('./authenticate');

var logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
// above uses two sets of parameters because its a 'FirstClassFn' which means it can return another function. When we envoke 'sessions-file-store', it returns the 'session' fn as its return value. 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const partnerRouter = require('./routes/partnerRouter');
const promotionRouter = require('./routes/promotionRouter');

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'),
    err => console.log(err)
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321')); // commented out to prevent issues with cookie parser and express cookies

app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false, //when a session is begun but no further data is given , the data is 'useless' therfore dropped to prevent having a bunch of empty session files and cookies. 
    resave: false,
    store: new FileStore() // this sets up files to be store in the application file store, not just application memory.  
}))
// auth Logs and inspects request header, if not authenticated it responds with an authentication form and returns an error message.

// If an authorization header is provided, it will parse the authorization header and validate the username and password by decoding its Base-64 value. It then takes that info and stores it as an object in an array auth. 

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req, res, next) {
    console.log(req.user);

    if (!req.user) {
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
    } else {
        return next();
    }
}
app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
