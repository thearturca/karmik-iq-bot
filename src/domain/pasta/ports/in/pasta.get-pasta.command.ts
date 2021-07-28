    export class PastaGetPastaCommand {
        constructor(
            private readonly _pastaName: string
        ) {}

        get pastaName(): string {
            return this._pastaName;
        }
    }