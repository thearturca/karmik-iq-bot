export class AddPastaCommand {
    constructor(
        private readonly _pasta: string,
        private readonly _alias: string = "pasta",
    ) {}

        get pasta(): string {
            return this._pasta;
        }

        get alias(): string {
            return this._alias;
        }
}