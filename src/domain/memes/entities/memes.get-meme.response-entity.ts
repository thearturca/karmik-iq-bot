

export class MemesGetMemeResponseEntity {
    constructor(
        private readonly _status: boolean,
        private readonly _meme?: string,
        private readonly _memeMessage?: string
    ) {}

    get status(): boolean {
        return this._status;
    }

    get meme(): string {
        if (this._meme === undefined) return "No such meme"
        return this._meme;
    }

    get memeMessage(): string {
        if (this._memeMessage === undefined) return "No such meme"
        return this._memeMessage;
    }
}