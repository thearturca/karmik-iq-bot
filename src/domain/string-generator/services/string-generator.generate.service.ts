import { StringGeneratorGenerateCommand } from "../ports/in/string-generator.generate.command";
import { StringGeneratorGenerateUseCase } from "../ports/in/string-generator.generate.use-case";
import { MessageGeneratorLoadMessagesPort } from "../ports/out/message-generator.load-strings.port";


export class StringGeneratorGenerateService implements StringGeneratorGenerateUseCase {
    constructor(
        private readonly _stringGeneratorLoadStringsPort: MessageGeneratorLoadMessagesPort
    ) {

    }

    async generate(command: StringGeneratorGenerateCommand): Promise<string> {

        const strings: string[] = await this._stringGeneratorLoadStringsPort.loadMessages(command.type, command.subType);
        const random: number = Math.floor(Math.random() * (strings.length));
        return strings[random];
    }
}