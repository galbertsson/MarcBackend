import { expect } from 'chai';
import { describe } from 'mocha';
import sinon from 'sinon';
import * as DBConnection from '../../../src/controller/dataConnection/MongoConnection';
import IDeck from '../../../src/types/IDeck';
import { Response, Request } from 'express';
import { createDeck } from '../../../src/controller/api';

describe('Unit Test: GET /api/decks/create', () => {
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
        const mockDB: IDeck = { _id: '1', ownerId: '1', title: 'Test', notes: [] };

        const stubbedDB = sinon.stub(DBConnection, 'createDeck').resolves();

        createDeck(
            {
                user: { username: 'foo', password: 'bar', id: '1' },
                body: mockDB,
            } as unknown as Request,
            {
                sendStatus: (status: number) => {
                    expect(status).equal(200);
                    expect(stubbedDB.callCount).to.equal(1);
                    expect(stubbedDB.args[0][1]).to.deep.equal(mockDB.title);
                    expect(stubbedDB.args[0][2]).to.deep.equal(mockDB.notes);
                    done();
                },
            } as unknown as Response
        );

    });
});