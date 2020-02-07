import { Response, Request } from 'express';
import IUser from '../types/IUser';
import { getDecksFromUser, createDeck as createDeckDb } from './dataConnection/DBConnection';
import { get } from 'lodash';

export const getDecks = (req: Request, res: Response) => {
    if (req.user) {
        const decks = getDecksFromUser(req.user as IUser);
        res.json(decks);
    } else {
        res.sendStatus(401);
    }
};

export const createDeck = (req: Request, res: Response) => {
    const deckTitle: string = get(req, 'body.title');
    const deckNotes: any = get(req, 'body.notes'); //TODO: Not sure how to handle this, array of almost ClozeNote or BasicNote, need to validate. Or maybe DB validates?
    const user: IUser = req.user as IUser;

    if (req.user && deckTitle && deckNotes) {
        createDeckDb(user, deckTitle, deckNotes);
        res.sendStatus(200);
    } else if (!req.user) {
        res.sendStatus(401);
    } else {
        res.sendStatus(400);
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