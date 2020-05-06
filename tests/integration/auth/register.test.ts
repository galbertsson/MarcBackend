import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../../src/app';
import { initConnection } from '../../../src/controller/dataConnection/MongoConnection';

const mongoDB = new MongoMemoryServer();

let userCookies: string[] = [];
let csrfToken: string;

describe('Integration Test: POST /register', () => {

    before(async () => {
        await mongoDB.start();
        const uri = await mongoDB.getUri();

        await initConnection(uri);

        const resp = await request(app)
            .get('/csrf');

        userCookies = resp.header['set-cookie'];
        csrfToken = resp.body.token;
    });

    it('Should be able to register account', done => {
        request(app)
            .post('/register')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send('username=GMan&password=superSafePassword')
            .expect(200, done);
    });

    it('Should not be able to register account with no username', done => {
        request(app)
            .post('/register')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send('password=superSafePassword')
            .expect(400, done);
    });

    it('Should not be able to register account with empty username', done => {
        request(app)
            .post('/register')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send('username=&password=superSafePassword')
            .expect(400, done);
    });

    it('Should not be able to register duplicate usernames', done => {
        request(app)
            .post('/register')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send('username=Alex&password=AlexSafePassword')
            .expect(200, () => {
                request(app)
                    .post('/register')
                    .set('csrf-token', csrfToken)
                    .set('Cookie', userCookies)
                    .send('username=Alex&password=AlexNotSoSafePassword')
                    .expect(400, done);
            });
    });
});