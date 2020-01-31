import mongoose from 'mongoose';
import IDeck from '../../types/IDeck';
import IUser from '../../types/IUser';
import { UserModel } from '../../types/mongoose/IUserModel';
import dotenv from 'dotenv';

dotenv.config();

const initConnection = () => {
    mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
};

const getDecksFromUser = (user: IUser): IDeck[] => {
    //TODO: Database magic
    const testDeck: IDeck = { _id: '1', title: 'Deck Test', ownerId: '1', notes: [] };
    return [testDeck];
};

const createDeck = (deck: IDeck): boolean => {
    //TODO: database magic
    return true;
};

const createUser = (username: string, hashedPassword: string): Promise<boolean> => {
    const newUser = new UserModel({username: username, password: hashedPassword});
    console.log('Active DB', mongoose.connection.db.databaseName);
    return new Promise((resolve, reject) => {
        newUser.save((err) => {
            if (err) {
                reject();
            }

            resolve(true);
        });
    });
};

const getUserFromUsername = (username: string): Promise<IUser> => {
    console.log('L/F', username);
    return new Promise((resolve, reject) => 
        UserModel.findOne({username: username}, (err, user) => {
            console.log('user', user);
            console.log('err', err);
            if (err) {
                console.log('Going to reject', err);
                reject(err);
            };
            if (!user) { //TODO: Look into how we can catch this in the middleware
                console.log('Going to reject!', user);
                reject('no_matching_user');
            } 

            resolve(user);
        })
    );
};

const getUserFromId = (id: string): Promise<IUser> => {
    return new Promise((resolve, reject) => 
        UserModel.findById(id)
            .then(user => resolve(user))
            .catch(err => reject(err))
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