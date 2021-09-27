

export class PastaGetPastaResponseEntity {
    constructor(
        private readonly _status: boolean,
        private readonly _pasta?: string,
        private readonly _pastaId?: number,
        private readonly _pastaMessage?: string
    ) {}

    get status(): boolean {
        return this._status;
    }

   

    get pasta(): string {
        if (this._pasta === undefined) return "Нет пасты"
        return this._pasta;
    }

    get pastaId(): number | null {
        if(this._pastaId === undefined) return null;
        return this._pastaId
    }

    get pastaMessage(): string {
        if (this._pastaMessage === undefined) return "Нет пасты"
        return this._pastaMessage;
    }
}