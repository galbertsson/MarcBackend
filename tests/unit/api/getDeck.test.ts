import { expect } from 'chai';
import { describe } from 'mocha';
import IDeck from '../../../src/types/IDeck';
import { Response, Request } from 'express';
import { getDeck } from '../../../src/controller/api';


describe('Unit Test: GET /api/decks', () => {
    it('Don\'t send decks to non logged in user', done => {
        let jsonResponse;
        let statusResponse;

        getDeck(
            { params: { id: '1' } } as unknown as Request,
            {
                sendStatus: (status: number) => statusResponse = status,
                json: (json: IDeck) => jsonResponse = json
            } as unknown as Response
        );

        expect(statusResponse).equal(401);
        expect(jsonResponse).to.deep.equal(undefined);

        done();
    });

    it('Don\'t send anything if no deck id is specified', done => {
        getDeck(
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