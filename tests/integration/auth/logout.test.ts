import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../../src/app';
import { initConnection } from '../../../src/controller/dataConnection/MongoConnection';

const mongoDB = new MongoMemoryServer();

describe('Integration Test: POST /logout', () => {

    before(async () => {
        await mongoDB.start();
        const uri = await mongoDB.getUri();

        await initConnection(uri);

        await request(app)
            .post('/register')
            .send('username=GMan&password=superSafePassword');
    });

    it('Should not be able to use cookie after logout', (done) => {
        (async () => {
            const resp = await request(app)
                .post('/login')
                .send('username=GMan&password=superSafePassword');

            const userCookies = resp.header['set-cookie'];

            const deck = {
                title: 'Test Deck',
                notes: [
                    { front: 'Test Front', back: 'Test Back' },
                ]
            };

            //Test that cookie works before logout
            await request(app)
                .post('/api/decks/create')
                .set('Cookie', userCookies)
                .send(deck)
                .expect(200)
                .catch(err => done(err));

            await request(app)
                .post('/logout')
                .set('Cookie', userCookies)
                .send()
                .expect(200)
                .catch(err => done(err));


            await request(app)
                .post('/api/decks/create')
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
            .expect(401, done);
    });

    it('Doing logout twice causes no strange behavior', done => {
        (async function () {
            const resp = await request(app)
                .post('/login')
                .send('username=GMan&password=superSafePassword');

            const userCookies = resp.header['set-cookie'];

            await request(app)
                .post('/logout')
                .set('Cookie', userCookies)
                .expect(200)
                .catch(err => done(err));

            await request(app)
                .post('/logout')
                .set('Cookie', userCookies)
                .expect(401)
                .catch(err => done(err));

            done();
        })();
    });
});