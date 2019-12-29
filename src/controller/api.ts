import { Response, Request } from 'express';
import { get } from 'lodash';

export const getApi = (req: Request, res: Response) => {
    const id = req.session.id;
    const visited = get(req.session, 'times', 0);
    req.session.times = visited + 1;
    res.send(`Id: ${id} has visisted ${visited} times`);
};
