import { Document, Schema, model } from 'mongoose';
import IDeck from 'IDeck';
import uuid = require('uuid');
import { BasicNoteSchema } from './IBasicNoteModel';
import { ClozeNoteSchema } from './IClozeNoteModel';

const deckSchema = new Schema({
    _id: { type: String, default: uuid.v4 },
    ownerId: String,
    title: String,
    notes: [BasicNoteSchema, ClozeNoteSchema]
});

export const DeckModel = model<IDeck & Document>('Deck', deckSchema);