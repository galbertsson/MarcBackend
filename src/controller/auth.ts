import { Response, Request, NextFunction } from 'express';
import { createUser } from './dataConnection/DBConnection';
import { get } from 'lodash';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { UserModel } from '../types/mongoose/IUserModel';

export const register = (req: Request, res: Response) => {
    const username = get(req, 'body.username');
    const password = get(req, 'body.password');

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            res.sendStatus(500);
        } else if (username && hash) {
            createUser(username, hash)
            .then(() => {
                UserModel.find({username: 'Alex'}, (err, users) => {
                    console.log('users', users);
                    res.sendStatus(200);
                });
            })
            .catch(() => res.sendStatus(401));
        } else {
            res.sendStatus(400);
        }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', function(err, user) {
        
        if (err && err !== 'no_matching_user') { //Something wrong with DB
            res.sendStatus(500);
            return;
        } else if (!user || err === 'no_matching_user') { //wrong password or non existing username
            res.statusCode = 401;
            res.json({message: 'invalid_credentials'});
            return;
        } else { //Correct login
            req.login(user, (err) => {
                if (err) {
                    next(err);
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