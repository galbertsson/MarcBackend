import { Response, Request } from 'express';
import { connectionInstance } from './dataConnection/DBConnection';
import { get } from 'lodash';
import bcrypt from 'bcrypt';

export const register = (req: Request, res: Response) => {
    const username = get(req, 'body.username');
    const password = get(req, 'body.password');
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) res.sendStatus(500);

        if (username && hash) {
            connectionInstance.createUser(username, hash);
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    });
};

export const login = (req: Request, res: Response) => {
    res.sendStatus(200);
};

export const logout = (req: Request, res: Response) => {
    req.logOut();
    res.sendStatus(200);
};