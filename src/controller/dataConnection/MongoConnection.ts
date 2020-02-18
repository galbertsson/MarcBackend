import IDeck from '../../types/IDeck';
import IUser from '../../types/IUser';
import BasicNote from 'IBasicNote';
import ClozeNote from 'IClozeNote';
import { MongoClient, Db, ObjectID } from 'mongodb';
import deckSchema from '../../types/schemas/deckSchema';
import userSchema from '../../types/schemas/userSchema';
import { map } from 'lodash';

const DB_NAME = 'marc';

let db: Db;

const collections = {
    users: { indexes: [{ username: 1 }], schema: userSchema },
    decks: { indexes: [] as {}[], schema: deckSchema }
};

const initConnection = (uri: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(uri, (err, resMongoClient) => {
            if (err) {
                reject(err);
            } else {
                db = resMongoClient.db(DB_NAME);

                for (const [key, data] of Object.entries(collections)) {
                    db.createCollection(key, data.schema).then(() => {
                        for (const index of data.indexes) {
                            db.collection(key).createIndex(index, { unique: true });
                        }
                    });
                }

                resolve(true);
            }
        });
    });
};

const getDecksFromUser = (user: IUser): IDeck[] => {
    //TODO: Database magic
    //const testDeck: IDeck = { _id: '1', title: 'Deck Test', ownerId: '1', notes: [] };
    return [];
};

const createDeck = (user: IUser, title: string, notes: Array<BasicNote | ClozeNote>): Promise<boolean> => {
    const notesWithId = map(notes, (note) => ({ _id: new ObjectID(), ...note }));
    const deck = { ownerId: new ObjectID(user._id), title, notes: notesWithId };

    return new Promise((resolve, reject) => {
        db.collection('decks').insertOne(deck, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

const createUser = (username: string, hashedPassword: string): Promise<boolean> => {
    const newUser = { username: username, password: hashedPassword };
    return new Promise((resolve, reject) => {
        db.collection('users').insertOne(newUser, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

const getUserFromUsername = (username: string): Promise<IUser> => {
    return new Promise((resolve, reject) =>
        db.collection('users').findOne({ username: username }, (err, user) => {
            if (err) {
                reject(err);
            };
            if (!user) {
                reject('no_matching_user_name');
            }

            resolve(user);
        })
    );
};

const getUserFromId = (id: string): Promise<IUser> => {
    return new Promise((resolve, reject) =>
        db.collection('users').findOne({ _id: new ObjectID(id) }, (err, user) => {
            if (err) {
                reject(err);
            };
            if (!user) {
                reject('no_matching_user_id');
            }

            resolve(user);
        })
    );
};

export {
    initConnection,
    getDecksFromUser,
    createDeck,
    createUser,
    getUserFromUsername,
    getUserFromId
};