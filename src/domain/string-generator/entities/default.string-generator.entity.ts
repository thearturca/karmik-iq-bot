import { StringGeneratorEntity } from "./string-generator.entity";


export class DefaultStringGeneratorEntity implements StringGeneratorEntity {
    constructor() {}

    generate(): string {
        return "Default string generator"
    }
}