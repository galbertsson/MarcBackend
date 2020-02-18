import { expect } from 'chai';
import { describe } from 'mocha';
import sinon from 'sinon';
import * as DBConnection from '../../../src/controller/dataConnection/MongoConnection';
import IDeck from '../../../src/types/IDeck';
import { Response, Request } from 'express';
import { register } from '../../../src/controller/auth';
import { compareSync } from 'bcrypt';

describe('Unit Test: POST /register', () => {
    it('Cannot register without a password', done => {
        let jsonResponse;
        let statusResponse;

        register(
            { body: { username: 'Gordon' } } as unknown as Request,
            {
                sendStatus: (status: number) => statusResponse = status,
                json: (json: IDeck) => jsonResponse = json
            } as unknown as Response
        );

        expect(statusResponse).equal(400);
        expect(jsonResponse).to.deep.equal(undefined);

        done();
    });

    it('Cannot register without a username', done => {

        register(
            {
                body: { password: 'AntiMassSpectrometer' }
            } as unknown as Request,
            {
                sendStatus: (status: number) => {
                    expect(status).equal(400);
                    done();
                },
            } as unknown as Response
        );
    });

    it('Should be allowed to register with username and password, and bcrypt used', done => {
        const password = 'AntiMassSpectrometer';

        const stubbedDB = sinon.stub(DBConnection, 'createUser').resolves();

        register(
            {
                body: {
                    username: 'FreeMan',
                    password: password
                }
            } as unknown as Request,
            {
                sendStatus: (status: number) => {
                    expect(status).equal(200);
                    expect(stubbedDB.callCount).to.equal(1);
                    expect(stubbedDB.args[0][0]).to.be.equal('FreeMan');
                    expect(compareSync(password, stubbedDB.args[0][1])).to.be.true;
                    done();
                },
            } as unknown as Response
        );

    });
});