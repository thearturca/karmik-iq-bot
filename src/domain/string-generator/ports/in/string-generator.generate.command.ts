

export class StringGeneratorGenerateCommand {
    constructor(
        private readonly _type: string,
        private readonly _subtype: string
    ) {}
    
    get type():string {
        return this._type;
    }

    get subType(): string {
        return this._subtype;
    }
}