import { IqUserEntity } from "../../entities/iq.user.entity";


export interface IqUpdateUserStatePort {
    updateUser(user: IqUserEntity): any

    updateActivities(user: IqUserEntity): any
}