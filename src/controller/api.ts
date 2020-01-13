import { Response, Request } from 'express';
import IUser from '../types/IUser';
import IDeck from '../types/IDeck';
import { connectionInstance } from './dataConnection/DBConnection';
import User from '../types/IUser';

export const getDecks = (req: Request, res: Response) => {
    if (req.user) {
        const decks = connectionInstance.getDecksFromUser(req.user as IUser);
        res.json(decks);
    } else {
        res.sendStatus(401);
    }
};

export const createDeck = (req: Request, res: Response) => {
    const deck: IDeck = req.body;

    if (req.user && deck) {
        connectionInstance.createDeck(deck);
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
};

export const getDeck = (req: Request, res: Response) => {
    //req.params.id
    res.sendStatus(404);
};

export const editDeck = (req: Request, res: Response) => {
    res.sendStatus(404);
};

export const deleteDeck = (req: Request, res: Response) => {
    res.sendStatus(404);
};