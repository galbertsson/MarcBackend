import { Document, Schema, model } from 'mongoose';
import IUser from 'IUser';
import uuid = require('uuid');

const userSchema = new Schema({
    _id: {type: String, default: uuid.v4},
    username: {type: String, unique: true},
    password: String
});

export const UserModel = model<IUser & Document>('User', userSchema);