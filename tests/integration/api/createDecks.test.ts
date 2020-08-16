import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../../src/app';
import { initConnection } from '../../../src/controller/dataConnection/MongoConnection';

const mongoDB = new MongoMemoryServer({ autoStart: false });

let userCookies: string[] = [];
let csrfToken: string;

let nonLoggedInUserCookies: string[] = [];
let nonLoggedInCsrfToken: string;

describe('Integration Test: POST /Create', () => {

    before(async () => {
        await mongoDB.start();
        const uri = await mongoDB.getUri();

        await initConnection(uri);

        const csrfRes = await request(app)
            .get('/csrf');

        csrfToken = csrfRes.body.token;
        userCookies = csrfRes.header['set-cookie'];

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

        const csrfRes2 = await request(app)
            .get('/csrf');

        nonLoggedInCsrfToken = csrfRes2.body.token;
        nonLoggedInUserCookies = csrfRes2.header['set-cookie'];
    });

    it('Should not allow a user non logged in user to create deck', done => {
        const deck = {
            title: 'Test Deck',
            notes: [
                { front: 'Test Front', back: 'Test Back', type: 'basicNote' },
                { test: 'Cloze Text test', type: 'closeNote' }
            ]
        };

        request(app)
            .post('/api/decks/create')
            .set('Cookie', nonLoggedInUserCookies)
            .set('csrf-token', nonLoggedInCsrfToken)
            .send(deck)
            .expect(401, done);
    });

    it('Should not allow a user with no CSRF token to create deck', done => {
        const deck = {
            title: 'Test Deck',
            notes: [
                { front: 'Test Front', back: 'Test Back', type: 'basicNote' },
                { test: 'Cloze Text test', type: 'clozeNote' }
            ]
        };

        request(app)
            .post('/api/decks/create')
            .set('Cookie', userCookies)
            .send(deck)
            .expect(403, done);
    });

    it('Needs to supply cookie not just csrf token', done => {
        const deck = {
            title: 'Test Deck',
            notes: [
                { front: 'Test Front', back: 'Test Back', type: 'basicNote' },
                { test: 'Cloze Text test', type: 'clozeNote' }
            ]
        };

        request(app)
            .post('/api/decks/create')
            .set('csrf-token', csrfToken)
            .send(deck)
            .expect(403, done);
    });

    it('CSRF token needs to match cookies token', done => {
        const deck = {
            title: 'Test Deck',
            notes: [
                { front: 'Test Front', back: 'Test Back', type: 'basicNote' },
                { test: 'Cloze Text test', type: 'clozeNote' }
            ]
        };

        request(app)
            .post('/api/decks/create')
            .set('Cookie', userCookies)
            .set('csrf-token', 'foo')
            .send(deck)
            .expect(403, done);
    });

    it('Should not allow malformed deck, no title', done => {
        const deck = {
            notes: [
                { front: 'Test Front', back: 'Test Back', type: 'basicNote' },
                { test: 'Cloze Text test', type: 'clozeNote' }
            ]
        };

        request(app)
            .post('/api/decks/create')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send(deck)
            .expect(400, done);
    });

    it('Should not allow malformed deck, malformed notes', done => {
        const deck = {
            title: 'My deck',
            notes: [
                { this: 'isWrong' }
            ]
        };

        request(app)
            .post('/api/decks/create')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send(deck)
            .expect(400, done);
    });

    it('Should be able to create deck when sending valid cookie', done => {
        const deck = {
            title: 'Test Deck',
            notes: [
                { front: 'Test Front', back: 'Test Back', type: 'basicNote' },
                { text: 'Cloze Text test', type: 'clozeNote' }
            ]
        };

        request(app)
            .post('/api/decks/create')
            .set('csrf-token', csrfToken)
            .set('Cookie', userCookies)
            .send(deck)
            .expect(200, done);
    });
});