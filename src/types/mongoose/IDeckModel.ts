import { Document, Schema, model } from 'mongoose';
import IDeck from 'IDeck';
import uuid = require('uuid');

const userSchema = new Schema({
    _id: { type: String, default: uuid.v4 },
    ownerId: String,
    title: String,
    notes: []
});

export const UserModel = model<IDeck & Document>('Deck', userSchema);