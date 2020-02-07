import { Schema } from 'mongoose';
import uuid = require('uuid');

export const ClozeNoteSchema = new Schema({
    _id: { type: String, default: uuid.v4 },
    front: String,
    back: String
});