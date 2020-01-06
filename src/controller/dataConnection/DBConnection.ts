import mongoose from 'mongoose';
import IDeck from '../../types/IDeck';
import IUser from '../../types/IUser';
import { UserModel } from '../../types/mongoose/IUserModel';

class DBConnection {

    constructor () {
        mongoose.connect('mongodb://localhost/marc', {useNewUrlParser: true, useUnifiedTopology: true });
    }

    getDecksFromUser(user: IUser): IDeck[] {
        //TODO: Database magic
        const testDeck: IDeck = { id: '1', title: 'Deck Test', ownerId: '1', notes: [] };
        return [testDeck];
    };

    createDeck (): boolean {
        //TODO: database magic
        return true;
    }

    createUser(username: string, hashedPassword: string) {
        const newUser = new UserModel({username: username, password: hashedPassword});
        newUser.save((err, user) => {
            if (err) console.log(err);
            console.log('user', user);
        });
    }

    getUserFromUsername(username: string): Promise<IUser> {
        return new Promise((resolve, reject) => 
            UserModel.findOne({username: username}, (err, user) => {
                if (err) reject(err);
                if (!user) reject('No User Found');

                resolve(user);
            })
        );
    }

    getUserFromId(id: string): Promise<IUser> {
        return new Promise((resolve, reject) => 
            UserModel.findById(id)
                .then(user => resolve(user))
                .catch(err => reject(err))
        );
    }
}

export const connectionInstance = new DBConnection();