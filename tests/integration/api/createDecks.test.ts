import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../../src/app';
import { initConnection } from '../../../src/controller/dataConnection/DBConnection';
import { UserModel } from '../../../src/types/mongoose/IUserModel';

const mongoDB = new MongoMemoryServer({ autoStart: false });

describe('Integration Test: POST /Create', () => {

    before(async () => {
        await mongoDB.start();
        const uri = await mongoDB.getUri();

        await initConnection(uri);
        await UserModel.ensureIndexes();
    });

    it('Should be able to register account', done => {
        request(app)
            .post('/register')
            .send('username=GMan&password=superSafePassword')
            .expect(200, done);
    });
});