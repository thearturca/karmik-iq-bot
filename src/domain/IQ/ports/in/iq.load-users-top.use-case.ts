import { IqUserEntity } from "../../entities/iq.user.entity";
import { IqLoadUsersTopCommand } from "../in/iq.load-users-top.command";


export interface IqLoadUsersTopUseCase {
    loadUsersTop(command: IqLoadUsersTopCommand): Promise<IqUserEntity[]>
}