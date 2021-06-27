import { StringGeneratorGenerateCommand } from "./string-generator.generate.command";


export interface StringGeneratorGenerateUseCase {
    generate(command: StringGeneratorGenerateCommand): Promise<string>;
}