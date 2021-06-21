import { IqUserEntity } from "../entities/iq.user.entity";
import { IqTestCommand } from "../ports/in/iq.test.command";
import { IqTestUseCase } from "../ports/in/iq.test.use-case";


export class IqTestService implements IqTestUseCase {
    constructor () {}
    async test(command: IqTestCommand): Promise<IqUserEntity> {
        const user = command.user;
        user.rollIq();
        return user;
    }
}