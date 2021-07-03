import { IqUserEntity } from "../../entities/iq.user.entity";
import { order } from "../in/iq.load-users-top.command";


export interface IqLoadUsersTopPort {
    loadUsers(take: number, order: order): Promise<IqUserEntity[]>
}