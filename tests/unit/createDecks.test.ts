import { expect } from 'chai';
import { describe } from 'mocha';
import sinon from 'sinon';
import { connectionInstance } from '../../src/controller/dataConnection/DBConnection';
import IDeck from '../../src/types/IDeck';
import { Response, Request } from 'express';
import { createDeck } from '../../src/controller/api';

describe('GET /api/decks/create', () => {
    it('Don\'t allow a non-logged in user to create a deck', done => {
        let jsonResponse;
        let statusResponse;

        createDeck(
            {} as unknown as Request,
            {
                sendStatus: (status: number) => statusResponse = status,
                json: (json: IDeck) => jsonResponse = json
            } as unknown as Response
        );

        expect(statusResponse).equal(401);
        expect(jsonResponse).to.deep.equal(undefined);

        done();
    });

    it('Only allow a logged in user to create decks', done => {
        const mockDB: IDeck[] = [
            {id: '1', ownerId: '1', title: 'Test', notes: []},
            {id: '2', ownerId: '2', title: 'Test2', notes: []}
        ];

        const stubbedDB = sinon.stub(connectionInstance, 'getDecksFromUser');
        stubbedDB.callsFake(() => {
            return mockDB;
        });

        let jsonResponse;
        let statusResponse;

        createDeck(
            { user: { username: 'foo', password: 'bar', id: '1' } } as unknown as Request,
            {
                sendStatus: (status: number) => statusResponse = status,
                json: (json: IDeck) => jsonResponse = json
            } as unknown as Response
        );

        expect(statusResponse).equal(undefined);
        expect(jsonResponse).to.deep.equal(mockDB);
        
        done();
    });
});
