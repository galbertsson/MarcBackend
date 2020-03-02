import { Response, Request, NextFunction } from 'express';
import { createUser } from './dataConnection/MongoConnection';
import { get } from 'lodash';
import bcrypt from 'bcrypt';
import passport from 'passport';

export const register = (req: Request, res: Response) => {
    const username = get(req, 'body.username');
    const password = get(req, 'body.password');

    if (!username || !password) {
        res.sendStatus(400);
    } else {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                res.sendStatus(500);
            } else if (hash) {
                createUser(username, hash)
                    .then(() => res.sendStatus(200))
                    .catch(() => res.sendStatus(400));
            } else {
                res.sendStatus(400);
            }
        });
    }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
    const username = get(req, 'body.username');
    const password = get(req, 'body.password');

    //Want type conversion
    if (username == null || password == null) {
        res.sendStatus(400);
        return;
    }

    passport.authenticate('local', function (err, user) {
        if (err && err === 'bad_request'){
            res.sendStatus(400);
        } 
        else if (err && err !== 'invalid_credentials') { //Something wrong with DB
            res.sendStatus(500);
            return;
        } else if (!user || err === 'invalid_credentials') { //wrong password or non existing username
            res.statusCode = 401;
            res.json({ message: 'invalid_credentials' });
            return;
        } else { //Correct login
            req.login(user, (err) => {
                if (err) {
                    next(err); //TODO: Is this wrong?; Seems strange?
                }

                res.sendStatus(200);
            });
        }
    })(req, res, next);
};

export const logout = (req: Request, res: Response) => {
    req.logOut();
    res.sendStatus(200);
};