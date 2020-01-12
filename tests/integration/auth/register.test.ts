import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app, { start } from '../../../src/app';

const mongoDB = new MongoMemoryServer();

describe('POST /register', () => {

    before(async () => {

        const uri = await mongoDB.getUri();
        const port = await mongoDB.getPort();

        process.env.MONGO_URL = `${uri}:${port}`;
        
        //TODO: Could this be done nicer?, Needs to set env before creating it
        //app = require('../../../src/app');
        start();
    });

    it('Should be able to register account', done => {
        console.log('app', app);
        request(app)
        .post('/register')
        .send('name=GMan&password=superSafePassword')
        .expect(200, done);
    });
});