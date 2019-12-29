import Note from 'Note';

export default class ClozeNote extends Note {

    private _text: string;

    constructor(text: string, id: string) {
        super(id);
        this._text=text;
    }

    get text(): string {
        return this._text;
    }

    set text(text: string) {
        this._text = text;
    }
}