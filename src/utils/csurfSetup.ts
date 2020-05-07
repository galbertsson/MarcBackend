import { Request, Response, NextFunction } from 'express';

const CSURF_ERROR = 'EBADCSRFTOKEN';

export function csrfErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err.code !== CSURF_ERROR) {
        return next(err);
    }

    res.sendStatus(403);
}