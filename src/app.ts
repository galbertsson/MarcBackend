'use strict';
import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';

import IUser from './types/IUser';

import * as apiController from './controller/api';
import * as authController from './controller/auth';
import { connectionInstance } from './controller/dataConnection/DBConnection';
import { compare } from 'bcrypt';

/* const users = [
    {username: 'foo', password: 'bar', id: '1'},
    {username: 'foo1', password: 'bar', id: '2'},
    {username: 'foo2', password: 'bar', id: '3'},
    {username: 'foo3', password: 'bar', id: '4'}
]; */

dotenv.config();

export const app = express();

const port = 8080;

if (!process.env.ENVIRONMENT || !process.env.COOKIE_SECRET) {
    console.error('.env file it not correctly configured');
    process.exit(1);
}

passport.use(new Strategy((username, password, done) => {

    //TODO: replace with logic to get info from db
    //const user = users.find(user => user.username === username && user.password === password);
    connectionInstance.getUserFromUsername(username)
        .then(user => compare(password, user.password))
        .then(isCorrectPassword => {
            if (isCorrectPassword) {
                done(null, user);
            } else {
                done('Incorrect password', false);
            }
        })
        .catch(err => done(err, false));

    /* if(user) {
        return done(null, user);
    }

    return done(null, false); */
}));

passport.serializeUser((user: IUser, done) => {
    
    done(null, user._id);
});

passport.deserializeUser((id: string, done) => {
    
    connectionInstance.getUserFromId(id)
        .then(user => done(null, user))
        .catch(err => done(err, false));
/* 
    if (user) {
        return done(null, user);
    }

    
    return done(null, false); */
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

app.get('/api/decks', apiController.getDecks);
app.post('/api/decks/create', apiController.createDeck);
app.get('/decks/:id', apiController.getDeck);
app.post('/decks/edit', apiController.editDeck);
app.delete('/decks/:id', apiController.deleteDeck);

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