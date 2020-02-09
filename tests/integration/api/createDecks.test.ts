import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../../src/app';
import { initConnection } from '../../../src/controller/dataConnection/DBConnection';
import { UserModel } from '../../../src/types/mongoose/IUserModel';

const mongoDB = new MongoMemoryServer({ autoStart: false });

let userCookies: string[] = [];

describe('Integration Test: POST /Create', () => {

    before(async () => {
        await mongoDB.start();
        const uri = await mongoDB.getUri();

        await initConnection(uri);
        await UserModel.ensureIndexes();

        await request(app)
            .post('/register')
            .send('username=GMan&password=superSafePassword');

        const resp = await request(app)
            .post('/login')
            .send('username=GMan&password=superSafePassword');


        userCookies = resp.header['set-cookie'];
    });

    it('Should not allow non-logged in user to create', done => {
        const deck = {
            title: 'Test Deck',
            notes: [
                {front: 'Test Front', back: 'Test Back'},
                {test: 'Cloze Text test'}
            ]
        };

        request(app)
            .post('/api/decks/create')
            .send(deck)
            .expect(401, done);
    });

    it('Should not allow malformed deck, no title', done => {
        const deck = {
            notes: [
                {front: 'Test Front', back: 'Test Back'},
                {test: 'Cloze Text test'}
            ]
        };

        request(app)
            .post('/api/decks/create')
            .set('Cookie', userCookies)
            .send(deck)
            .expect(400, done);
    });

    it('Should not allow malformed deck, malformed notes', done => {
        const deck = {
            title: 'My deck',
            notes: [
                {this: 'isWrong'}
            ]
        };

        request(app)
            .post('/api/decks/create')
            .set('Cookie', userCookies)
            .send(deck)
            .expect(400, done);
    });

    it('Should be able to create deck when sending valid cookie', done => {
        const deck = {
            title: 'Test Deck',
            notes: [
                {front: 'Test Front', back: 'Test Back'},
                {test: 'Cloze Text test'}
            ]
        };

        request(app)
            .post('/api/decks/create')
            .set('Cookie', userCookies)
            .send(deck)
            .expect(200, done);
    });
});