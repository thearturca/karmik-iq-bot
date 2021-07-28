

export class PastaGetPastaResponseEntity {
    constructor(
        private readonly _status: boolean,
        private readonly _pasta?: string,
        private readonly _pastaMessage?: string
    ) {}

    get status(): boolean {
        return this._status;
    }

    get pasta(): string {
        if (this._pasta === undefined) return "No such pasta"
        return this._pasta;
    }

    get pastaMessage(): string {
        if (this._pastaMessage === undefined) return "No such pasta"
        return this._pastaMessage;
    }
}