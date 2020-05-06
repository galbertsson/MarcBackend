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
let csrfToken: string;
let csrfToken2: string;

describe('Integration Test: DELETE /api/deck', () => {

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

        await request(app)
            .post('/login')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send('username=GMan&password=superSafePassword');

        const resp2 = await request(app)
            .get('/csrf');

        user2Cookies = resp2.header['set-cookie'];
        csrfToken2 = resp2.body.token;

        await request(app)
            .post('/register')
            .set('csrf-token', csrfToken2)
            .set('Cookie', user2Cookies)
            .send('username=GMan2&password=superSafePassword');

        await request(app)
            .post('/login')
            .set('csrf-token', csrfToken2)
            .set('Cookie', user2Cookies)
            .send('username=GMan2&password=superSafePassword');

    });

    it('Should be allowed to delete our own deck', done => {
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
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send(deck)
                .expect(200)
                .catch(err => done(err));

            const res = await request(app)
                .get('/api/decks')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send();

            const deckId = res.body[0]._id;

            await request(app)
                .delete(`/api/decks/${deckId}`)
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send()
                .then(res => {
                    expect(res.status).to.be.equal(200);
                })
                .catch(err => done(err));

            await request(app)
                .get(`/api/decks/${deckId}`)
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send()
                .then(res => {
                    expect(res.status).to.be.equal(401);
                    expect(res.body).to.deep.equal({});

                    done();
                })
                .catch(err => done(err));
        })();
    });

    it('Should not be allowed to delete any other users deck', (done) => {
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
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send(deck)
                .expect(200)
                .catch(err => done(err));

            const res = await request(app)
                .get('/api/decks')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send();

            const deckId = res.body[0]._id;

            await request(app)
                .delete(`/api/decks/${deckId}`)
                .set('csrf-token', csrfToken2)
                .set('Cookie', user2Cookies)
                .send()
                .then(res => {
                    expect(res.status).to.be.equal(400);
                })
                .catch(err => done(err));

            await request(app)
                .get(`/api/decks/${deckId}`)
                .set('csrf-token', csrfToken)
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

    it('Must be logged in to delete deck', (done) => {
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
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send(deck)
                .expect(200)
                .catch(err => done(err));

            const res = await request(app)
                .get('/api/decks')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send();

            const deckId = res.body[0]._id;

            await request(app)
                .delete(`/api/decks/${deckId}`)
                .send()
                .then(res => {
                    expect(res.status).to.be.equal(403);
                })
                .catch(err => done(err));

            await request(app)
                .get(`/api/decks/${deckId}`)
                .set('Cookie', userCookies)
                .set('csrf-token', csrfToken)
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

    it('Must supply CSRF token to delete deck', (done) => {
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
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send(deck)
                .expect(200)
                .catch(err => done(err));

            const res = await request(app)
                .get('/api/decks')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send();

            const deckId = res.body[0]._id;

            await request(app)
                .delete(`/api/decks/${deckId}`)
                .set('Cookie', csrfToken)
                .send()
                .then(res => {
                    expect(res.status).to.be.equal(403);
                })
                .catch(err => done(err));

            await request(app)
                .get(`/api/decks/${deckId}`)
                .set('Cookie', userCookies)
                .set('csrf-token', csrfToken)
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

    it('Must supply valid CSRF token to delete deck', (done) => {
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
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send(deck)
                .expect(200)
                .catch(err => done(err));

            const res = await request(app)
                .get('/api/decks')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send();

            const deckId = res.body[0]._id;

            await request(app)
                .delete(`/api/decks/${deckId}`)
                .set('Cookie', csrfToken)
                .set('csrf-token', 'fakeToken')
                .send()
                .then(res => {
                    expect(res.status).to.be.equal(403);
                })
                .catch(err => done(err));

            await request(app)
                .get(`/api/decks/${deckId}`)
                .set('Cookie', userCookies)
                .set('csrf-token', csrfToken)
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
});