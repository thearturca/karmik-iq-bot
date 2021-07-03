import { IqUserEntity } from "../entities/iq.user.entity";
import { IqLoadUsersTopCommand } from "../ports/in/iq.load-users-top.command";
import { IqLoadUsersTopUseCase } from "../ports/in/iq.load-users-top.use-case";
import { IqLoadUsersTopPort} from "../ports/out/iq.load-users-top.port";


export class IqTopService implements IqLoadUsersTopUseCase {
    constructor(
        private readonly _IqLoadUsersTopPort: IqLoadUsersTopPort
    ) {}

    async loadUsersTop(command: IqLoadUsersTopCommand): Promise<IqUserEntity[]> {
        const users: IqUserEntity[] = await this._IqLoadUsersTopPort.loadUsers(command.take, command.order);
        return users;
    }
}