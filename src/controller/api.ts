import { Response, Request } from 'express';
import IUser from '../types/IUser';
import IDeck from '../types/IDeck';
import { getDecksFromUser, createDeck as createDeckDb, getUsersDeckFromId, deleteUsersDeckFromId, editExistingDeck } from './dataConnection/MongoConnection';
import { get } from 'lodash';
import ClozeNote from 'IClozeNote';
import BasicNote from 'IBasicNote';

export const getDecks = (req: Request, res: Response) => {
    console.log('session', req.session);
    console.log('Got a request from user', req.user);

    if (req.user) {
        getDecksFromUser(req.user as IUser)
            .then((decks) => {
                res.statusCode = 200;
                res.json(decks);
            })
            .catch(() => {
                res.sendStatus(500);
            });

    } else {
        res.sendStatus(401);
    }
};

export const createDeck = (req: Request, res: Response) => {
    const deckTitle: string = get(req, 'body.title');
    const deckNotes: Array<ClozeNote | BasicNote> = get(req, 'body.notes');
    const user: IUser = req.user as IUser;

    if (req.user) {
        createDeckDb(user, deckTitle, deckNotes)
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(400));
    } else if (!req.user) {
        res.sendStatus(401);
    } else {
        res.sendStatus(400);
    }
};

export const getDeck = (req: Request, res: Response) => {
    const deckId = get(req, 'params.id');

    const user: IUser = req.user as IUser;

    if (!user) {
        res.sendStatus(401);
    } else if (!deckId) {
        res.sendStatus(400);
    } else {
        getUsersDeckFromId(user, deckId)
            .then((deck) => {
                if (deck) {
                    res.statusCode = 200;
                    res.json(deck);
                } else {
                    res.sendStatus(401);
                }
            })
            .catch(() => res.sendStatus(400));
    }
};

export const editDeck = (req: Request, res: Response) => {
    const user: IUser = req.user as IUser;
    const deck: IDeck = req.body as IDeck;

    if (!user) {
        res.sendStatus(401);
    } else if (!deck) {
        res.sendStatus(400);
    } else {
        editExistingDeck(user, deck)
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(400));
    }
};

export const deleteDeck = (req: Request, res: Response) => {
    const deckId = get(req, 'params.id');
    const user: IUser = req.user as IUser;

    if (!user) {
        res.sendStatus(401);
    } else if (!deckId) {
        res.sendStatus(400);
    } else {
        deleteUsersDeckFromId(user, deckId)
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(400));
    }
};