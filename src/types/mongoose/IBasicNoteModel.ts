import { Schema } from 'mongoose';
import uuid = require('uuid');

export const BasicNoteSchema = new Schema({
    _id: { type: String, default: uuid.v4 },
    text: String
});