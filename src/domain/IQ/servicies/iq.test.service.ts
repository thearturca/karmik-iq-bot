import { IqTestResultEntity } from "../entities/iq.test-result.entity";
import { IqTestCommand } from "../ports/in/iq.test.command";
import { IqTestUseCase } from "../ports/in/iq.test.use-case";


export class IqTestService implements IqTestUseCase {
    constructor () {}
    async test(command: IqTestCommand): IqTestResultEntity {
        const user = 
        return ;
    }
}