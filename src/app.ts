'use strict';
import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';

import IUser from './types/IUser';

import * as apiController from './controller/api';
import * as authController from './controller/auth';
import { compare } from 'bcrypt';
import { getUserFromId, getUserFromUsername, initConnection } from './controller/dataConnection/MongoConnection';
import bodyParser from 'body-parser';


dotenv.config();

const app = express();
//TODO: separate into app and server
const port = 8080;

if (!process.env.ENVIRONMENT || !process.env.COOKIE_SECRET) {
    console.error('.env file it not correctly configured');
    process.exit(1);
}

passport.use(new Strategy((username, password, done) => {

    let dbUser: IUser;
    console.log('username', username);

    getUserFromUsername(username)
        .then(user => {
            console.log('A user', user);
            dbUser = user;
            return compare(password, user.password);
        })
        .then(isCorrectPassword => {
            if (isCorrectPassword) {
                console.log('Correct!');
                done(null, dbUser);
            } else {
                console.log('incorrect password');
                done('Incorrect password', false);
            }
        })
        .catch(err => {
            console.log('err', err);
            done(err, false);
        });

}));

passport.serializeUser((user: IUser, done) => {
    done(null, user._id);
});

passport.deserializeUser((id: string, done) => {
    console.log('Deserializing', id);
    getUserFromId(id)
        .then(user => {
            console.log('Found user'); 
            done(null, user);
        })
        .catch(err => {
            console.log('Lost user');
            done(err, false);
        });

});

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.ENVIRONMENT !== 'DEV' }
}));

app.use(urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/decks', apiController.getDecks);
app.post('/api/decks/create', apiController.createDeck);
app.get('/decks/:id', apiController.getDeck);
app.post('/decks/edit', apiController.editDeck);
app.delete('/decks/:id', apiController.deleteDeck);

//No need to be authenticated to access
app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/logout', authController.logout);

export function start() {
    app.listen(port, err => {
        if (err) {
            return console.error(err);
        }
        initConnection(process.env.MONGO_URL);
        return console.log(`Server is running on port ${port}`);
    });
};

export default app;