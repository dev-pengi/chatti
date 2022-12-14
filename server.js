console.clear();
require('dotenv').config()

//express
const express = require('express');
const session = require("express-session");
const fileupload = require("express-fileupload");
const flash = require('req-flash');
const cookieParser = require('cookie-parser')
const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => { console.log(`app listening to ${port}`); })

//database
const mongoose = require('mongoose');
const users = require('./models/users')

//passport
const passport = require("passport");

//Events
const connections = require('./events/connections');
require('./events/handler');
connections.database();

//socket
const io = require("socket.io")(server);

//Routes
const redirects = require('./routes/redirects')

//Others
const check = require('./events/check')
const bodyparser = require("body-parser")
const path = require("path");
const livereload = require("livereload");
const MemoryStore = require("memorystore")(session);
let test_mode = process.env.TEST

const sessionMiddleware = session({
    secret: 'DBE1CAF4635A3',
    cookie: { maxAge: (1000 * 60 * 60 * 24 * 7) },
    saveUninitialized: false,
    resave: true,
})

//express
app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(flash());

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
    callbackURL: process.env.cb,
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
        return done(null, profile);
    });
}));

app.get('/login/google', (req, res) => {
    if (req.query.goTo) req.flash('returnTo', `${req.query.goTo}`);
    res.redirect('/login/auth/google');
})
app.get('/login/auth/google', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
    const user = req.user._json
    const save_user = await users.findOneAndUpdate(
        {
            id: user.sub,
            email: user.email,
        },
        {
            name: user.name,
            avatar: user.picture,
            locale: user.locale,
            auth_provider: req.user.provider,
        },
        {
            upsert: true,
            new: true
        }).catch(err => { console.log(err); });
    //success redirect
    console.log(save_user);
    if (!save_user) return res.redirect('/login')
    if (req.flash('returnTo')) {
        res.redirect(`${req.flash('returnTo')}`);
    }
    else res.redirect('/chat');
});

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
app.use(passport.initialize());
app.use(passport.session());

//logout
app.get('/logout', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/main');
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login', { pagetitle: 'Chatti - login' });
})
app.get('/chat/:id', (req, res) => {
    const check_user = check.user(req, res);
    if (!check_user) return;
    res.render('chat', { pagetitle: 'Chatti - User' });
})
app.get('/chat', (req, res) => {
    const check_user = check.user(req, res);
    if (!check_user) return;
    res.render('main_chat', { pagetitle: 'Chatti - User' });
})


// run
redirects(app);
require('./api/api')(app);


const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
    if (socket.request.user) {
        next();
    } else {
        next(new Error('unauthorized'))
    }
});


const contacts = require('./models/contacts')
const tools = require('./events/tools')
let sockets = []
io.on('connection', (socket) => {
    const user = check.user_socket(socket);
    if (!user) return;
    let socket_data = {
        userID: user.sub,
        socket_id: socket.id
    }
    sockets.push(socket_data);
    socket.on('messages', async (data, response) => {
        const user1 = await users.findOne({ id: user.sub });
        const user2 = await users.findOne({ id: data.to });
        if (!user1) return socket.emit('redirect', '/login/auth/google');
        if (!user2) return socket.emit('error', { status: '403', reason: 'user not found' });
        if (user1.id == user2.id) return socket.emit('error', { status: '403', reason: 'hey Yo, you can\t text your self' });
        if (!data.content.trim().length) return response({ error: 403, reason: 'invalid message' });
        const message = {
            message: data.content,
            createdOn: Date.now(),
            type: 'text',
            by: {
                id: user1.id,
                name: user1.name,
                avt: user1.avatar,
            },
            to: {
                id: user2.id,
                name: user2.name,
                avt: user2.avatar,
            },
        }
        let chat_id = tools.chat_id(user1.id, user2.id)
        let chat_data = await contacts.findOneAndUpdate(
            {
                id: chat_id,
            },
            {
                $push: { messages: message }
            },
            {
                upsert: true,
                new: true
            }).catch(err => { return });
        if (!chat_data) return socket.emit('error', { destination: '/login/auth/google' });
        response('sent');
        sockets.filter(sockett => sockett.userID == user2.id).map(sockett => {
            var socketById = io.sockets.sockets.get(sockett.socket_id);
            if (!socketById) return;
            socketById.emit("message", message)
        })
        sockets.filter(sockett => sockett.userID == user1.id).map(sockett => {
            var socketById = io.sockets.sockets.get(sockett.socket_id);
            if (!socketById) return;
            const current = (sockett.socket_id == socket.id);
            socketById.emit("my_message", {
                message: message.message,
                createdOn: message.createdOn,
                type: 'text',
                by: {
                    id: user1.id,
                    name: user1.name,
                    avt: user1.avatar,
                },
                to: {
                    id: user2.id,
                    name: user2.name,
                    avt: user2.avatar,
                },
                current: current,
            })
        })
        if (!user1.contacts.includes(user2.id)) {
            const doc = await users.findOneAndUpdate(
                {
                    id: user1.id,
                    contacts: { $nin: [user2.id] },
                },
                {
                    $push: { contacts: user2.id },
                }
            )
        }
        if (!user2.contacts.includes(user1.id)) {
            const doc = await users.findOneAndUpdate(
                {
                    id: user2.id,
                    contacts: { $nin: [user1.id] },
                },
                {
                    $push: { contacts: user1.id },
                }
            )
        }
    })

    // socket.on('typing', async (data) => {
    //     sockets.filter(sockett => sockett.userID == data.to).map(sockett => {
    //         var socketById = io.sockets.sockets.get(sockett.socket_id);
    //         if (!socketById) return;
    //         socketById.emit("typing", { data: user.picture })
    //     })
    // })
    // socket.on('remove_typing', async (data) => {
    //     sockets.filter(sockett => sockett.userID == data.to).map(sockett => {
    //         var socketById = io.sockets.sockets.get(sockett.socket_id);
    //         if (!socketById) return;
    //         socketById.emit("remove_typing")
    //     })
    // })
})

