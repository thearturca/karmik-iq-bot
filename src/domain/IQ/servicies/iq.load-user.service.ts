import { IqUserEntity } from "../entities/iq.user.entity";
import { IqLoadUserCommand } from "../ports/in/iq.load-user.command";
import { IqLoadUserUseCase } from "../ports/in/iq.load-user.use-case";
import { IqLoadUserPort } from "../ports/out/iq.load-user.port";


export class IqLoadUserService implements IqLoadUserUseCase{

    constructor(
        private readonly _iqLoadUserPort: IqLoadUserPort
    ) {}

        async loadUser(command: IqLoadUserCommand): Promise<IqUserEntity> {
            const user = await this._iqLoadUserPort.loadUser(command.username);
            return user;
        }
}