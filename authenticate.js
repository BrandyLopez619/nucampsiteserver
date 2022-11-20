// Implement Local Strategy
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config.js')

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 }); // 1hr
};

// configure JSON web strategy for Passport
const opts = {};
// .fromAuthHeaderAsBearerToken insructs on how to extract web token. a token can be extracted form header, in the request body or even as a Url query parameter.please send it to us in the Authorization Header as a Bearer Token
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// supplies the JWT strategy with the key with which to sign the token?
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({ _id: jwt_payload._id }, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = function (req, res, next) {
    if (req.user.admin === true) {
        return next();
    } else {
        const err = new Error('You are not authorized to perform this operation');
        err.status = 403;
        return next(err);
    }
};

//verifies if request if from authenticated use using 'jwt' strategy not using sessions. This verifyUser export can now be used as a fucntional shorthand for authenticating a User with these methods and spare us having to type it every time.

