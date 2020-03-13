import { describe } from 'mocha';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../../src/app';
import { initConnection } from '../../../src/controller/dataConnection/MongoConnection';
import { omit } from 'lodash';

const mongoDB = new MongoMemoryServer({ autoStart: false });

let userCookies: string[] = [];
let user2Cookies: string[] = [];

describe('Integration Test: POST /api/deck', () => {

    before(async () => {
        await mongoDB.start();
        const uri = await mongoDB.getUri();

        await initConnection(uri);

        await request(app)
            .post('/register')
            .send('username=GMan&password=superSafePassword');

        const resp = await request(app)
            .post('/login')
            .send('username=GMan&password=superSafePassword');

        await request(app)
            .post('/register')
            .send('username=GMan2&password=superSafePassword');

        const resp2 = await request(app)
            .post('/login')
            .send('username=GMan2&password=superSafePassword');

        userCookies = resp.header['set-cookie'];
        user2Cookies = resp2.header['set-cookie'];
    });

    it('Should be allowed to get our own deck', done => {
        (async function () {
            const deck = {
                title: 'Test Deck',
                notes: [
                    { front: 'Test Front', back: 'Test Back' },
                    { text: 'Cloze Text test' }
                ]
            };

            await request(app)
                .post('/api/decks/create')
                .set('Cookie', userCookies)
                .send(deck)
                .expect(200)
                .catch(err => done(err));
            
            const res = await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send();

            const deckId = res.body[0]._id;

            await request(app)
                .get(`/api/decks/${deckId}`)
                .set('Cookie', userCookies)
                .send()
                .then(res => {
                    expect(res.status).to.be.equal(200);
                    const cleanedRes = omit(res.body, ['ownerId', '_id']);
                    const cleanedNotes = res.body.notes.map((note: any) => omit(note, ['_id']));

                    cleanedRes.notes = cleanedNotes;

                    expect(cleanedRes).to.deep.equal(deck);

                    done();
                })
                .catch(err => done(err));
        })();
    });

    it('Should not be allowed any other users deck', (done) => {
        (async function () {
            const deck = {
                title: 'Test Deck',
                notes: [
                    { front: 'Test Front', back: 'Test Back' },
                    { text: 'Cloze Text test' }
                ]
            };

            await request(app)
                .post('/api/decks/create')
                .set('Cookie', userCookies)
                .send(deck)
                .expect(200)
                .catch(err => done(err));
            
            const res = await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send();

            const deckId = res.body[0]._id;

            await request(app)
                .get(`/api/decks/${deckId}`)
                .set('Cookie', user2Cookies)
                .send()
                .then(res => {
                    expect(res.status).to.be.equal(401);
                    expect(res.body).to.deep.equal({});

                    done();
                })
                .catch(err => done(err));
        })();
    });

    it('Must be logged in to request decks', (done) => {
        (async function () {
            const deck = {
                title: 'Test Deck',
                notes: [
                    { front: 'Test Front', back: 'Test Back' },
                    { text: 'Cloze Text test' }
                ]
            };

            await request(app)
                .post('/api/decks/create')
                .set('Cookie', userCookies)
                .send(deck)
                .expect(200)
                .catch(err => done(err));

            await request(app)
                .get('/api/decks')
                .send()
                .then(res => {
                    expect(res.status).to.be.equal(401);
                    expect(res.body).to.deep.equal({});
                    done();
                })
                .catch(err => done(err));
        })();
    });
});