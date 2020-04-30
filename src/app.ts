'use strict';
import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import session from 'express-session';
import passport from 'passport';
import csrf from 'csurf';

import * as apiController from './controller/api';
import * as authController from './controller/auth';
import * as csrfController from './controller/csrf';
import { initConnection } from './controller/dataConnection/MongoConnection';
import bodyParser from 'body-parser';
import initPassport from './utils/passportSetup';
import cookieParser from 'cookie-parser';
import { csrfErrorHandler } from './utils/csurfSetup';


dotenv.config();

const app = express();
const port = 8080;

if (!process.env.ENVIRONMENT || !process.env.COOKIE_SECRET) {
    console.error('.env file it not correctly configured');
    process.exit(1);
}

initPassport();

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.ENVIRONMENT !== 'DEV',
        httpOnly: true,
        sameSite: 'lax'
    },
}));

app.use(urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(csrf({}));
app.use(csrfErrorHandler);

app.get('/api/decks', apiController.getDecks);
app.post('/api/decks/create', apiController.createDeck);
app.get('/api/decks/:id', apiController.getDeck);
app.post('/api/decks/edit', apiController.editDeck);
app.delete('/api/decks/:id', apiController.deleteDeck);

//No need to be authenticated to access
app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/logout', authController.logout);

app.get('/csrf', csrfController.getToken);

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