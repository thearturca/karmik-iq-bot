import { StringGeneratorEntity } from "./string-generator.entity";

export class IqStringGenerator implements StringGeneratorEntity {
    constructor() {}

    generate(): string {
        return "Iq string generator"
    }
}