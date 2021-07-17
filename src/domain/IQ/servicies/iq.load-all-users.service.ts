import { IqUserEntity } from "../entities/iq.user.entity";
import { IqLoadAllUsersUseCase } from "../ports/in/iq.load-all-users.use-case";
import { IqLoadAllUsersPort } from "../ports/out/iq.load-all-users.port";


export  class IqLoadAllUsersService implements IqLoadAllUsersUseCase {
    constructor(
        private readonly _iqLoadAllUsersPort: IqLoadAllUsersPort
    ) {}

    async loadAllUsers(): Promise<IqUserEntity[]> {
        return await this._iqLoadAllUsersPort.loadAllUsers();
    }
}