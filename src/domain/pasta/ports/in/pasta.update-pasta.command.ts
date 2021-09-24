export class UpdatePastaCommand {
    constructor(
        private readonly _pastaId: number,
        private readonly _pasta: string,
    ) {}

        get pastaId(): number {
            return this._pastaId;
        }

        get pasta(): string {
            return this._pasta;
        }
}