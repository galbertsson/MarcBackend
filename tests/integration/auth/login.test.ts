import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../../src/app';
import { initConnection } from '../../../src/controller/dataConnection/MongoConnection';

const mongoDB = new MongoMemoryServer();

let userCookies: string[] = [];
let csrfToken: string;

describe('Integration Test: POST /login', () => {

    before(async () => {
        await mongoDB.start();
        const uri = await mongoDB.getUri();

        await initConnection(uri);

        const resp = await request(app)
            .get('/csrf');

        userCookies = resp.header['set-cookie'];
        csrfToken = resp.body.token;

        await request(app)
            .post('/register')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send('username=GMan&password=superSafePassword');
    });

    it('Needs to supply username', done => {
        request(app)
            .post('/login')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send('password=superSafePassword')
            .expect(400, done);
    });

    it('Needs to supply non empty username', done => {
        request(app)
            .post('/login')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send('username=&password=superSafePassword')
            .expect(401, done);
    });

    it('Needs to supply password', done => {
        request(app)
            .post('/login')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send('username=GMan')
            .expect(400, done);
    });

    it('Cannot login with an invalid password', done => {
        request(app)
            .post('/login')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send('username=Gman&password=fakePass')
            .expect(401, done);
    });

    it('Can sign in with valid password', done => {
        request(app)
            .post('/login')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send('username=GMan&password=superSafePassword')
            .expect(200, done);
    });
});