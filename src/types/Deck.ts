import Note from 'Note';

export default class Deck {

    private _id: string;
    private _ownerId: string;
    private _title: string;
    private _deck: Array<Note> = [];

    constructor(id: string, ownerId: string, title: string) {
        this._ownerId = ownerId;
        this._title = title;
        this._id=id;
    }

    get ownerId(): string {
        return this._ownerId;
    }

    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    set title(title: string) {
        this._title = title;
    }

    addNote = (note: Note) => {
        this._deck.push(note);
    }

    removeNote = (index: number) => {
        this._deck.splice(index);
    }
}