import { StringGeneratorGenerateCommand } from "./string-generator.generate.command";


export class IqStringGeneratorGenerateTestCommand implements StringGeneratorGenerateCommand {
    constructor (
        readonly _type: string,
        private readonly _subtype: string
    ) {}

    get type(): string {
        return this.type;
    }
}