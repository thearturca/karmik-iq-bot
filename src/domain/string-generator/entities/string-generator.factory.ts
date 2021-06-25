import { DefaultStringGeneratorEntity } from "./default.string-generator.entity";
import { StringGeneratorEntity } from "./string-generator.entity";
import { IqStringGenerator } from "./iq.string-generator.entity";


export class StringGeneratorFactory {
    constructor () {}

    static getGenerator(stringType: string): StringGeneratorEntity {
        switch(stringType) {
            case "iq":
                return new IqStringGenerator();

            default:
                return new DefaultStringGeneratorEntity();

        }
    }
}