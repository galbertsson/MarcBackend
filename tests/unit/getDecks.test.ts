import { expect } from 'chai';
import { describe } from 'mocha';
import sinon from 'sinon';
import { connectionInstance } from '../../src/controller/dataConnection/DBConnection';
import IDeck from '../../src/types/IDeck';
import { Response, Request } from 'express';
import { getDecks } from '../../src/controller/api';

describe('GET /api/decks', () => {
    it('Don\'t send decks to non logged in, 401 no response', done => {
        let jsonResponse;
        let statusResponse;

        getDecks(
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

    it('Only send decks for logged in user', done => {
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

        getDecks(
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
