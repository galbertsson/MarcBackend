import Note from 'Note';

export default class BasicNote extends Note{

    private _front: string;
    private _back: string;

    constructor(front: string, back: string, id: string) {
        super(id);
        this._front=front;
        this._back=back;
    }

    get front(): string {
        return this._front;
    }

    set front(front: string) {
        this._front = front;
    }

    get back(): string {
        return this._back;
    }

    set back(back: string) {
        this._back = back;
    }
}