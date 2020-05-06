import { describe } from 'mocha';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../../src/app';
import { initConnection } from '../../../src/controller/dataConnection/MongoConnection';
import { cloneDeep } from 'lodash';

const mongoDB = new MongoMemoryServer({ autoStart: false });

let userCookies: string[] = [];
let user2Cookies: string[] = [];
let csrfToken: string;
let csrfToken2: string;

let nonLoggedInUserCookies: string[] = [];
let nonLoggedInCsrfToken: string;

describe('Integration Test: POST /api/edit', () => {

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

        const csrfRes2 = await request(app)
            .get('/csrf');

        nonLoggedInCsrfToken = csrfRes2.body.token;
        nonLoggedInUserCookies = csrfRes2.header['set-cookie'];
    });

    it('Should not allow non-logged in user to edit', done => {
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
                .send(deck);

            const res = await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send();

            await request(app)
                .post('/api/decks/edit')
                .send(deck)
                .set('Cookie', nonLoggedInUserCookies)
                .set('cstf-token', nonLoggedInCsrfToken)
                .then((res) => {
                    expect(res.status).to.be.equal(403);
                })
                .catch(err => done(err));

            await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send()
                .then(res2 => {
                    expect(res.body).to.deep.equal(res2.body);
                    done();
                })
                .catch(err => done(err));
        })();
    });

    it('Need to supply csrf token', done => {
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
                .send(deck);

            const res = await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send();

            await request(app)
                .post('/api/decks/edit')
                .send(deck)
                .set('Cookie', userCookies)
                .then((res) => {
                    expect(res.status).to.be.equal(403);
                })
                .catch(err => done(err));

            await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send()
                .then(res2 => {
                    expect(res.body).to.deep.equal(res2.body);
                    done();
                })
                .catch(err => done(err));
        })();
    });

    it('Need to supply valid csrf token', done => {
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
                .send(deck);

            const res = await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send();

            await request(app)
                .post('/api/decks/edit')
                .send(deck)
                .set('Cookie', userCookies)
                .set('csrf-token', 'invalidToken')
                .then((res) => {
                    expect(res.status).to.be.equal(403);
                })
                .catch(err => done(err));

            await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send()
                .then(res2 => {
                    expect(res.body).to.deep.equal(res2.body);
                    done();
                })
                .catch(err => done(err));
        })();
    });

    it('Should not allow non-owner to edit', done => {
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
                .send(deck);

            const res = await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send();

            await request(app)
                .post('/api/decks/edit')
                .set('Cookie', user2Cookies)
                .set('csrf-token', csrfToken2)
                .send(deck)
                .then((res) => {
                    expect(res.status).to.be.equal(400);
                })
                .catch(err => done(err));

            await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send()
                .then(res2 => {
                    expect(res.body).to.deep.equal(res2.body);
                    done();
                })
                .catch(err => done(err));
        })();
    });

    it('Should not edit if no deck is supplied', done => {
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
                .send(deck);

            const res = await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send();

            await request(app)
                .post('/api/decks/edit')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send()
                .then((res) => {
                    expect(res.status).to.be.equal(400);
                })
                .catch(err => done(err));

            await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send()
                .then(res2 => {
                    expect(res.body).to.deep.equal(res2.body);
                    done();
                })
                .catch(err => done(err));
        })();
    });

    it('Should not allow for malformed decks', done => {
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
                .send(deck);

            const res = await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send();

            const newDeck = cloneDeep(res.body[res.body.length - 1]);
            newDeck.title = 'Edited title';
            newDeck.notes[0] = { _id: newDeck.notes[0]._id, foo: 'nope' };

            await request(app)
                .post('/api/decks/edit')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send(newDeck)
                .then((res) => {
                    expect(res.status).to.be.equal(400);
                })
                .catch(err => done(err));

            await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send()
                .then(res2 => {
                    expect(res.body).to.deep.equal(res2.body);
                    done();
                })
                .catch(err => done(err));
        })();
    });

    it('Should allow for edit', done => {
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
                .send(deck);

            const res = await request(app)
                .get('/api/decks')
                .set('Cookie', userCookies)
                .send();

            const newDeck = cloneDeep(res.body[res.body.length - 1]);
            newDeck.title = 'Edited title';
            newDeck.notes[0] = { _id: newDeck.notes[0]._id, front: 'New front', back: 'Different Back' };

            await request(app)
                .post('/api/decks/edit')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send(newDeck)
                .then((res) => {
                    expect(res.status).to.be.equal(200);
                })
                .catch(err => done(err));

            await request(app)
                .get('/api/decks')
                .set('csrf-token', csrfToken)
                .set('Cookie', userCookies)
                .send()
                .then(res2 => {
                    res.body[res.body.length - 1] = newDeck;

                    expect(res2.body).to.deep.equal(res.body);
                    done();
                })
                .catch(err => done(err));
        })();
    });
});