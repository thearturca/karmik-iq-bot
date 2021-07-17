import { IqUserEntity } from "../../entities/iq.user.entity";


export interface IqLoadAllUsersPort {
    loadAllUsers(): Promise<IqUserEntity[]>;
}