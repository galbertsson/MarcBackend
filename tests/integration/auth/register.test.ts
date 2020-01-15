import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app, { start } from '../../../src/app';

const mongoDB = new MongoMemoryServer();

describe('POST /register', () => {

    before(async () => {
        const uri = await mongoDB.getUri();

        process.env.MONGO_URL = uri;
        
        //Start the express app
        start();
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

    it('Should not be able to register account with empty username', done => {
        request(app)
        .post('/register')
        .send('username=&password=superSafePassword')
        .expect(400, done);
    });

    it('Should not be able to register duplicate usernames', done => {
        request(app)
        .post('/register')
        .send('username=Alex&password=superSafePassword')
        .expect(200);

        request(app)
        .post('/register')
        .send('username=Alex&password=NotSoSafePassword')
        .expect(401, done);
    });
});