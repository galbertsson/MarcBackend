import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app, { start } from '../../../src/app';

const mongoDB = new MongoMemoryServer();

describe('Integration Test: POST /register', () => {

    before(async () => {
        const uri = await mongoDB.getUri();
        process.env.MONGO_URL = uri;

        //Start the express app
        start();
    });

    it('Should be able to register account', done => {
        request(app)
        .post('/create')
        .send('username=GMan&password=superSafePassword')
        .expect(200, done);
    });

});