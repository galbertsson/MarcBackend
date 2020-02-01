import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../../src/app';
import { initConnection } from '../../../src/controller/dataConnection/DBConnection';
import { UserModel } from '../../../src/types/mongoose/IUserModel';

const mongoDB = new MongoMemoryServer();

describe('Integration Test: POST /register', () => {

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

    it('Should not be able to register account with no username', done => {
        request(app)
            .post('/register')
            .send('password=superSafePassword')
            .expect(400, done);
    });

    it('Should not be able to register account with empty username', done => {
        request(app)
            .post('/register')
            .send('username=&password=superSafePassword')
            .expect(400, done);
    });

    it('Should not be able to register duplicate usernames', done => {
        request(app)
            .post('/register')
            .send('username=Alex&password=AlexSafePassword')
            .expect(200, () => {
                request(app)
                    .post('/register')
                    .send('username=Alex&password=AlexNotSoSafePassword')
                    .expect(401, done);
            });
    });
});