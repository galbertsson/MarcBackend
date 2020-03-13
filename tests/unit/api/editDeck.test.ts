import { expect } from 'chai';
import { describe } from 'mocha';
import IDeck from '../../../src/types/IDeck';
import { Response, Request } from 'express';
import { editDeck } from '../../../src/controller/api';


describe('Unit Test: POST /api/decks/edit', () => {
    it('Don\'t do anything if not logged in', done => {
        let jsonResponse;
        let statusResponse;

        const deck: IDeck = { _id: '1', ownerId: '1', title: 'Test', notes: [] };

        editDeck(
            { body: deck } as unknown as Request,
            {
                sendStatus: (status: number) => statusResponse = status,
                json: (json: IDeck) => jsonResponse = json
            } as unknown as Response
        );

        expect(statusResponse).equal(401);
        expect(jsonResponse).to.deep.equal(undefined);

        done();
    });

    it('Don\'t edit anything if no body is specified', done => {
        editDeck(
            { user: { username: 'foo', password: 'bar', id: '1' } } as unknown as Request,
            {
                sendStatus: (status: number) => {
                    expect(status).to.equal(400);
                    done();
                }
            } as unknown as Response
        );
    });
});