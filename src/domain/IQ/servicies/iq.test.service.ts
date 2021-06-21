import { IqUserEntity } from "../entities/iq.user.entity";
import { IqTestCommand } from "../ports/in/iq.test.command";
import { IqTestUseCase } from "../ports/in/iq.test.use-case";
import { IqLoadUserPort } from "../ports/out/iq.load-user.port";
import { IqUpdateUserStatePort } from "../ports/out/iq.update-user.port";


export class IqTestService implements IqTestUseCase {
    constructor (
        private readonly _iqLoadUserPort: IqLoadUserPort,
        private readonly _iqUpdateUserPort: IqUpdateUserStatePort
        ) {}
    async test(command: IqTestCommand): Promise<IqUserEntity> {
        const user: IqUserEntity = await this._iqLoadUserPort.loadUser(command.username);
        user.setIsSub = command.isSub;
        user.setIsVip = command.isVip;
        user.setSubMonths = command.subMonths;
        user.rollIq();
        await this._iqUpdateUserPort.updateUser(user);
        return user;
    }
}