console.clear();
require('dotenv').config()

//express
const express = require('express');
const session = require("express-session");
const fileupload = require("express-fileupload");
const app = express();
const port = process.env.PORT || 5000;

//database
const mongoose = require('mongoose');
const users = require('./models/users')

//passport
const passport = require("passport");

//Events
const connections = require('./events/connections');
require('./events/handler');
connections.database();


//Routes
const redirects = require('./routes/redirects')

//Others
const check = require('./events/check')
const bodyparser = require("body-parser")
const path = require("path");
const livereload = require("livereload");
const MemoryStore = require("memorystore")(session);
let test_mode = process.env.TEST
require('./api/api')(app)

//express
app.listen(port, 'localhost', () => { console.log(`app listening to ${port}`); })
app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());

//live reload
if (test_mode) {
    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch(path.join(__dirname, '/public/'));
    const connectLivereload = require("connect-livereload");
    const { kill } = require("process");
    const { fail } = require('assert');
    const { setTimeout } = require('timers/promises');
    app.use(connectLivereload());
    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 100);
    });
}







const GoogleStrategy = require('passport-google-oauth2').Strategy;


//Initalize the Discord Login
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    scope: ["email", "profile"],
    callbackURL: 'http://localhost:5000/login/auth/google',
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
        return done(null, profile);
    });
}));

app.use(session({
    secret: 'DBE1CAF4635A3',
    cookie: { maxAge: (1000 * 60 * 60 * 24 * 7) },
    saveUninitialized: false,
    resave: true,
}));
/*
{
  sub: '114999617844345065008',
  name: 'Jdjfj Dbfndn',
  given_name: 'Jdjfj',
  family_name: 'Dbfndn',
  picture: 'https://lh3.googleusercontent.com/a/AEdFTp6YfiOVyTSkgiKyeqK7uzG6KIIzP_AgLoSseEU_=s96-c',
  email: 'siffffdoul@gmail.com',
  email_verified: true,
  locale: 'ar'
}
*/
app.get('/login/auth/google', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
    const user = req.user._json
    const save_user = await users.findOneAndUpdate(
        {
            id: user.sub
        },
        {
            name: user.name,
            avatar: user.picture,
            email: user.email,
        },
        {
            upsert: true,
            new: true
        }).catch(err => { console.log(err);})
    //success redirect
    if (!save_user) return res.redirect('/login')
    console.log(save_user);
    res.redirect('/chat/id');
});

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
app.use(passport.initialize());
app.use(passport.session());

//logout
app.get('/logout', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/main');
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect("/");
    });
    res.redirect('/');
});




app.get('/login', (req, res) => {
    res.render('login', { pagetitle: 'Chatti - login' })
})
app.get('/chat/:id', (req, res) => {
    // const check_user = check.user(req, res)
    // if (!check_user) return;
    res.render('chat', { pagetitle: 'Chatti - User' })
})








// run
redirects(app)