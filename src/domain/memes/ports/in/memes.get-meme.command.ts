import { MemesTypes } from "../../entities/memes.factory-entity";


export class MemesGetMemeCommand {
    constructor(
        private readonly _message: string, 
        private readonly _username: string
        ) {}

        get message(): string {
            return this._message;
        }

        get username(): string {
            return this._username;
        }
}