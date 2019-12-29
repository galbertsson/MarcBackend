export default class User {

    private _username: string;
    private _password: string;
    private _id: string;

    constructor(username: string, password: string, id: string) {
        this._username=username;
        this._password=password;
        this._id=id;
    }

    get username(): string {
        return this._username;
    }

    set username(username: string) {
        this._username = username;
    }

    get password(): string {
        return this._password;
    }

    set password(password: string) {
        this._password = password;
    }

    get id(): string {
        return this._id;
    }
}