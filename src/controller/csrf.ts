import { Response, Request } from 'express';

export const getToken = (req: Request, res: Response) => {
    res.json({token: req.csrfToken()});
};
