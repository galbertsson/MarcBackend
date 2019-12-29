import { Response, Request } from 'express';

export const register = (req: Request, res: Response) => {

};

export const login = (req: Request, res: Response) => {
    console.log(req.session);
    res.sendStatus(200);
};

export const logout = (req: Request, res: Response) => {
    req.logOut();
    res.sendStatus(200);
};