import { IqTestResultEntity } from "../entities/iq.test-result.entity";
import { IqUserEntity } from "../entities/iq.user.entity";
import { IqTestCommand } from "../ports/in/iq.test.command";
import { IqTestUseCase } from "../ports/in/iq.test.use-case";
import { IqLoadOrAddUserPort } from "../ports/out/iq.load-or-add-user.port";
import { IqUpdateUserStatePort } from "../ports/out/iq.update-user.port";


export class IqTestService implements IqTestUseCase {
    constructor (
        private readonly _iqLoadOrAddUserPort: IqLoadOrAddUserPort,
        private readonly _iqUpdateUserPort: IqUpdateUserStatePort
        ) {}
    async test(command: IqTestCommand): Promise<IqTestResultEntity> {
        const user: IqUserEntity = await this._iqLoadOrAddUserPort.loadOrAddUser(command.username);
        user.setIsSub = command.isSub;
        user.setIsVip = command.isVip;
        user.setSubMonths = command.subMonths;
        const res = user.rollIq();
        if (res) {
            await this._iqUpdateUserPort.updateUser(user);
            await this._iqUpdateUserPort.updateActivities(user);
        }
        return new IqTestResultEntity(res, user.iq, user.lastTryTimestamp, user.maxTryNumber, user.tryNumber, user.timeBeforeTest);
    }
}