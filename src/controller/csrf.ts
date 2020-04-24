import { Response, Request } from 'express';

export const getCsrfToken = (req: Request, res: Response) => {    
    res.json({token: req.csrfToken()});
};
