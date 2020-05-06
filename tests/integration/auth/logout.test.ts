import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../../src/app';
import { initConnection } from '../../../src/controller/dataConnection/MongoConnection';

const mongoDB = new MongoMemoryServer();

let userCookies: string[] = [];
let csrfToken: string;

describe('Integration Test: POST /logout', () => {

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

    it('Should not be able to use cookie after logout', (done) => {
        (async () => {
            await request(app)
                .post('/login')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send('username=GMan&password=superSafePassword');

            const deck = {
                title: 'Test Deck',
                notes: [
                    { front: 'Test Front', back: 'Test Back' },
                ]
            };

            //Test that cookie works before logout
            await request(app)
                .post('/api/decks/create')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send(deck)
                .expect(200)
                .catch(err => done(err));

            await request(app)
                .post('/logout')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send()
                .expect(200)
                .catch(err => done(err));


            await request(app)
                .post('/api/decks/create')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send(deck)
                .expect(401)
                .catch(err => done(err));

            done();
        })();
    });

    it('Doing logout when not logged in causes no strange behavior', done => {
        request(app)
            .post('/logout')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .expect(401, done);
    });

    it('Doing logout twice causes no strange behavior', done => {
        (async function () {
            await request(app)
                .post('/login')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send('username=GMan&password=superSafePassword');

            // const userCookies = resp.header['set-cookie'];

            await request(app)
                .post('/logout')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .expect(200)
                .catch(err => done(err));

            await request(app)
                .post('/logout')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .expect(401)
                .catch(err => done(err));

            done();
        })();
    });
});