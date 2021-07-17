import { IqUserEntity } from "../../entities/iq.user.entity";

export interface IqLoadAllUsersUseCase {
    loadAllUsers(): Promise<IqUserEntity[]>;
}