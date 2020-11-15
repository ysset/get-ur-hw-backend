const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const VKStrategySetup = require('./passpotSetups/vkontakteSetup');
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const cors = require("cors");
const passport = require("passport");
const fileUpload = require('express-fileupload')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
mongoose
    .connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        const authCheck = (req, res, next) => {
            if (!req.user) {
                res.status(401).json({
                    authenticated: false,
                    message: "user has not been authenticated"
                });
            } else {
                next();
            }
        };
        app.use(
            cookieSession({
                name: "session",
                keys: [process.env.COOKIE_KEY],
                maxAge: 365 * 24 * 60 * 60 * 100
            })
        );
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'pug');

        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({extended: false}));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(passport.initialize())
        app.use(
            cors({
                origin: "*",
                methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
                credentials: true,
            })
        );

        app.get("/", authCheck, (req, res) => {
            res.status(200)
        })

        app.use('/', indexRouter);
        app.use('/users', usersRouter);


        app.listen(8000, () => {
            console.log('Server is running')
        })
    })
module.exports = app;
