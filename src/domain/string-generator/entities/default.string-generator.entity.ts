import { StringGeneratorEntity } from "./string-generator.entity";


export class DefaultStringGeneratorEntity implements StringGeneratorEntity {
    constructor(
        readonly _strings: string[] = []
    ) {}

    get strings(): string[] {
        return this._strings
    }

    generate(): string {
        return "Default string generator"
    }
}