'use strict';
import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';

import User from './types/User';

import * as apiController from './controller/api';
import * as authController from './controller/auth';

const users = [
    {username: 'foo', password: 'bar', id: '1'},
    {username: 'foo1', password: 'bar', id: '2'},
    {username: 'foo2', password: 'bar', id: '3'},
    {username: 'foo3', password: 'bar', id: '4'}
];

dotenv.config();

const app = express();

const port = 8080;

console.log(typeof process.env.COOKIE_SECRET, process.env.COOKIE_SECRET);

if (!process.env.ENVIRONMENT || !process.env.COOKIE_SECRET) {
    console.error('.env file it not correctly configured');
    process.exit(1);
}

passport.use(new Strategy((username, password, done) => {
    console.log('Test');
    //TODO: replace with logic to get info from db
    const user = users.find(user => user.username === username && user.password === password);
    if(user) {
        return done(null, user);
    }

    return done(null, false);
}));

passport.serializeUser((user: User, done) => {
    console.log('Test1');
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log('Test2');
    const user = users.find(user => user.id === id);

    if (user) {
        console.log('User found');
        return done(null, user);
    }

    console.log('User NOT found');
    return done(null, false);
});

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: process.env.ENVIRONMENT !== 'DEV'}
}));

app.use(urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/api', apiController.getApi);

//No need to be authenticated to access
app.post('/register', authController.register);
app.post('/login', passport.authenticate('local') ,authController.login);
app.post('/logout', authController.logout);


app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`Server is running on port ${port}`);
});