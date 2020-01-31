import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../../src/app';
import { initConnection } from '../../../src/controller/dataConnection/DBConnection';
import mongoose from 'mongoose';

const mongoDB = new MongoMemoryServer();

describe('Integration Test: POST /register', () => {

    before(async () => {
        console.log('BEFORE');
        const uri = await mongoDB.getUri();
        process.env.MONGO_URL = uri;

        initConnection();
    });

    it('Should be able to register account', done => {
        request(app)
        .post('/create')
        .send('username=GMan&password=superSafePassword')
        .expect(200, done);
    });

    after(async () => {
        console.log('AFTER');
        await mongoose.disconnect();
    });
});