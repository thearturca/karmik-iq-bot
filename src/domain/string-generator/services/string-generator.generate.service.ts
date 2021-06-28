import { StringGeneratorGenerateCommand } from "../ports/in/string-generator.generate.command";
import { StringGeneratorGenerateUseCase } from "../ports/in/string-generator.generate.use-case";
import { StringGeneratorLoadStringsPort } from "../ports/out/string-generator.load-strings.port";


export class StringGeneratorGenerateService implements StringGeneratorGenerateUseCase {
    constructor(
        private readonly _stringGeneratorLoadStringsPort: StringGeneratorLoadStringsPort
    ) {

    }

    async generate(command: StringGeneratorGenerateCommand): Promise<string> {

        const strings: string[] = await this._stringGeneratorLoadStringsPort.loadStrings(command.type)
        return ""
    }
}