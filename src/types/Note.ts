export default abstract class Note {

    private _id: string;

    constructor(id: string) {
        this._id=id;
    }

    get id(): string {
        return this._id;
    }
}