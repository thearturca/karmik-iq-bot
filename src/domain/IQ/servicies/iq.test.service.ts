import { IqTestCommand } from "../ports/in/iq.test.command";
import { IqTestUseCase } from "../ports/in/iq.test.use-case";


export class IqTestService implements IqTestUseCase {
    constructor () {}
    async test(command: IqTestCommand) {
        return true;
    }
}