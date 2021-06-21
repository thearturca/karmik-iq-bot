import { IqUserEntity } from "../../entities/iq.user.entity";


export interface IqLoadUserPort {
    loadUser(username: string): Promise<IqUserEntity>
}