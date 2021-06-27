import { StringGeneratorGenerateCommand } from "../ports/in/string-generator.generate.command";
import { StringGeneratorGenerateUseCase } from "../ports/in/string-generator.generate.use-case";


export class StringGeneratorGenerateService implements StringGeneratorGenerateUseCase {
    constructor() {

    }

    async generate(command: StringGeneratorGenerateCommand): Promise<string> {
        return ""
    }
}