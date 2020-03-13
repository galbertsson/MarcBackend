import { expect } from 'chai';
import { describe } from 'mocha';
import sinon from 'sinon';
import * as DBConnection from '../../../src/controller/dataConnection/MongoConnection';
import IDeck from '../../../src/types/IDeck';
import { Response, Request } from 'express';
import { getDecks } from '../../../src/controller/api';


describe('Unit Test: GET /api/decks', () => {
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
            { _id: '1', ownerId: '1', title: 'Test', notes: [] },
            { _id: '2', ownerId: '1', title: 'Test2', notes: [] }
        ];

        const stubbedDB = sinon.stub(DBConnection, 'getDecksFromUser');
        stubbedDB.callsFake(() => {
            return new Promise((resolve) => resolve(mockDB));
        });

        getDecks(
            { user: { username: 'foo', password: 'bar', id: '1' } } as unknown as Request,
            {
                json: (json: IDeck) => {
                    expect(json).to.deep.equal(mockDB);
                    done();
                }
            } as unknown as Response
        );
    });
});