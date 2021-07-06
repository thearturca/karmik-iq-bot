import { IqUserEntity } from "../../entities/iq.user.entity";


export interface IqLoadOrAddUserPort {
    loadOrAddUser(username: string): Promise<IqUserEntity>
}