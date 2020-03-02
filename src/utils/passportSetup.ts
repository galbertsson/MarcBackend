import passport from 'passport';
import { Strategy } from 'passport-local';
import IUser from '../types/IUser';
import { getUserFromId, getUserFromUsername } from '../controller/dataConnection/MongoConnection';
import { compare } from 'bcrypt';

export default () => {
    passport.use(new Strategy((username, password, done) => {
        if (!username || !password) {
            done('bad_request', false);
            return;
        }

        let dbUser: IUser;

        getUserFromUsername(username)
            .then(user => {
                dbUser = user;
                return compare(password, user.password);
            })
            .then(isCorrectPassword => {
                if (isCorrectPassword) {
                    done(null, dbUser);
                } else {
                    done('invalid_credentials', false);
                }
            })
            .catch(err => {
                if (err === 'no_matching_user_name') {
                    done('invalid_credentials', false);
                } else {
                    done(err, false);
                }
            });
    }));

    passport.serializeUser((user: IUser, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id: string, done) => {
        getUserFromId(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, false);
            });

    });
};