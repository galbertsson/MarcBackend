import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import session from 'express-session';
import passport from 'passport';
import csrf from 'csurf';
import cors from 'cors';
import connectRedis from 'connect-redis';
import redis from 'redis';

import * as apiController from './controller/api';
import * as authController from './controller/auth';
import * as csrfController from './controller/csrf';
import { initConnection } from './controller/dataConnection/MongoConnection';
import bodyParser from 'body-parser';
import initPassport from './utils/passportSetup';
import { csrfErrorHandler } from './utils/csurfSetup';


dotenv.config();

const app = express();
const port = 8080;

if (!process.env.ENVIRONMENT || !process.env.COOKIE_SECRET) {
    console.error('.env file it not correctly configured');
    process.exit(1);
}

// Enable for development, not needed when using sub domains
if (process.env.ENVIRONMENT === 'DEV') {
    app.use(cors({
        origin: 'http://127.0.0.1:3001',
        credentials: true
    }));
}

initPassport();

const sessionOptions: session.SessionOptions = {
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.ENVIRONMENT !== 'DEV',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 1 month max age
    },
};

if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
    console.log('Using Redis');
    const RedisStore = connectRedis(session);

    const redisClient = redis.createClient(parseInt(process.env.REDIS_PORT), process.env.REDIS_HOST);
    sessionOptions.store = new RedisStore({ client: redisClient });
} else {
    console.warn('No Redis ENV detected, session will be lost on restart');
}

app.use(session(sessionOptions));

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
    app.listen(port, () => {
        initConnection(process.env.MONGO_URL).catch((err) => {
            console.error(err);
            process.exit(129); // Could not connect to DB
        })
        return console.log(`Server is running on port ${port}`);
    });
};

export default app;